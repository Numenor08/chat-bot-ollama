"use client";

import { useState, useContext, useRef, useEffect, startTransition } from "react";
import MessageList from "@/app/ui/Message/Message";
import InputPrompt from "@/app/ui/InputPrompt";
import { Messages } from "@/app/types/types";
import { useModelContext } from "@/app/store/ContextProvider";
import { db } from "@/app/lib/dexie";
import { useParams, useRouter } from "next/navigation";

const convertImageToBase64 = async (image: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => {
            if (typeof reader.result === "string") {
                resolve(reader.result.split(",")[1]);
            } else {
                reject("Failed to read file as Base64");
            }
        };
        reader.onerror = () => reject("Failed to read file");
    });
};

const compressImage = async (imageFile: File, maxWidth = 1024): Promise<File> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const scaleFactor = maxWidth / img.width;
                canvas.width = maxWidth;
                canvas.height = img.height * scaleFactor;

                const ctx = canvas.getContext("2d");
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

                canvas.toBlob((blob) => {
                    resolve(new File([blob as Blob], imageFile.name, { type: "image/jpeg" }));
                }, "image/jpeg", 0.9); // Quality 90%
            };
        };
    });
};


const ChatApp = () => {
    const lastUpdatedMessageRef = useRef<Messages[]>([]);
    const lastReasoningTimeRef = useRef<number | null>(null);
    const { setLoading, setIsThinking, messages, setMessages, abortController, setAbortController } = useModelContext();
    const { threadId } = useParams();
    const router = useRouter();

    const handleCreateThread = async (title: string) => {
        const id = await db.createThread(title);
        return id;
    }

    const handleSendMessage = async (prompt: string, model: string, image: File| string | null) => {
        if (!prompt.trim()) return;

        // Convert image to Base64
        let imageBase64: string | null = null;
        if (image) {
            if (image instanceof File) {
                const compressedImage = await compressImage(image);
                imageBase64 = await convertImageToBase64(compressedImage);
            } else {
                imageBase64 = image;
            }
        }

        let currentThreadId: string | string[] | undefined = threadId;
        const newTitle: string = prompt.trim().length > 20 
            ? prompt.trim().slice(0, 1).toUpperCase() + prompt.trim().slice(1, 20) + "..." 
            : prompt.trim().charAt(0).toUpperCase() + prompt.trim().slice(1);

        if (!currentThreadId) {
            localStorage.setItem("pendingPrompt", prompt);
            localStorage.setItem("pendingModel", model);
            if (imageBase64) {
                localStorage.setItem("pendingImage", imageBase64);
            }

            currentThreadId = await handleCreateThread(newTitle);
            router.push(`/c/${currentThreadId}`);
        } else {
            await db.createMessage({
                thread_id: currentThreadId as string,
                role: 'user',
                content: prompt,
                image: imageBase64 ? [imageBase64] : null,
                reasoning_time: null
            })
            const InputMessages: Messages = { role: 'user', content: prompt, images: imageBase64 ? [imageBase64] : null };
    
            const newMessages: Messages[] = [
                ...messages,
                InputMessages,
                { role: "assistant", content: "", reasoningTime: 0 }, // Placeholder bot dengan reasoningTime
            ];
    
            setMessages(newMessages);
            sendMessageToBackend(newMessages, model, currentThreadId);
        }

    };

    const sendMessageToBackend = async (updatedMessages: Messages[], model: string, currentThreadId: string | string[]) => {
        try {
            setLoading(true);
            const controller = new AbortController();
            setAbortController(controller);

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: updatedMessages, model }),
                signal: controller.signal,
            });

            if (!res.body) throw new Error("Something went wrong");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let botReply = "";
            let reasoningTime = 0;
            const assistantIndex = updatedMessages.length - 1;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const textChunk = decoder.decode(value, { stream: true });
                const lines = textChunk.trim().split("\n");

                for (const line of lines) {
                    if (!line) continue;

                    try {
                        const { content, reasoningTime } = JSON.parse(line);
                        botReply += content;

                        if (content && content.includes("<think>")) {
                            setIsThinking(true);
                        }

                        if (content && content.includes("</think>")) {
                            setIsThinking(false);
                        }

                        setMessages((prev: Messages[]) => {
                            return prev.map((msg, index) => {
                                if (index === assistantIndex) {
                                    return { ...msg, content: botReply, reasoningTime };
                                }
                                return msg;
                            })
                        });
                    } catch (error) {
                        console.error("Error parsing JSON:", error);
                    }
                }
            }

            // Save the last message (Assistant) to the database
            await db.createMessage({
                thread_id: currentThreadId as string,
                role: 'assistant',
                content: botReply,
                image: null,
                reasoning_time: reasoningTime
            })

        } catch (error) {
            if (error instanceof Error) {
                if (error.name === "AbortError") {
                    console.warn("Request was aborted");
                
                    // Simpan pesan terakhir dengan reasoning time terakhir
                    setMessages((prev: Messages[]) => {
                        return prev.map((msg, index) =>
                            index === prev.length - 1
                                ? { ...msg, reasoningTime: lastReasoningTimeRef.current ?? msg.reasoningTime }
                                : msg
                        );
                    });
                
                    const remainderMessage = lastUpdatedMessageRef.current[lastUpdatedMessageRef.current.length - 1];
                    if (!remainderMessage) return;
                
                    await db.createMessage({
                        thread_id: currentThreadId as string,
                        role: 'assistant',
                        content: remainderMessage?.content,
                        image: null,
                        reasoning_time: lastReasoningTimeRef.current ?? remainderMessage?.reasoningTime,
                    });
                
                    return;
                }
                console.error("Error fetching response:", error);
            } else {
                console.error("Unknown error:", error);
            }
        } finally {
            setLoading(false);
            setAbortController(null);
        }
    };

    const handleCancelRequest = () => {
        if (abortController) {
            abortController.abort();
            setAbortController(null);
            setLoading(false);

            setMessages((prev: Messages[]) => {
                return prev.map((msg, index) => {
                    if (index === prev.length - 1) {
                        if (msg.reasoningTime) {
                            lastReasoningTimeRef.current = msg.reasoningTime;
                        }
                        return msg
                    } else {
                        return msg
                    }

                }
                );
            })
        }
    };

    useEffect(() => {
        if (!threadId) {
            setMessages([]);
        }
        return () => {
            if (abortController) {
                handleCancelRequest();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const fetchedMessages = await db.getMessagesByThreadId(threadId as string);
                setMessages(fetchedMessages.map(msg => ({ ...msg, reasoningTime: msg.reasoning_time ?? undefined })) as Messages[]);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        if (threadId) {
            fetchMessages();
        }
    }, [threadId]);

    useEffect(() => {
        const makeFirstRequest = async () => {
            if (threadId && messages.length === 0) {

                const prompt = localStorage.getItem("pendingPrompt");
                const model = localStorage.getItem("pendingModel");
                const imageBase64 = localStorage.getItem("pendingImage") || null;

                localStorage.removeItem("pendingPrompt");
                localStorage.removeItem("pendingModel");
                localStorage.removeItem("pendingImage");

                if (prompt && model) {
                    handleSendMessage(prompt, model, imageBase64);
                }
            }
        };

        makeFirstRequest();
    }, [threadId]);

    useEffect(() => {
        lastUpdatedMessageRef.current = messages;
    }, [messages]);

    return (
        <div className={`flex flex-col items-center ${messages.length > 0 ? "justify-between" : "justify-center"} h-screen py-8 w-full min-w-80 max-w-[50rem] gap-8`}>
            <div className={`${messages.length > 0 ? "hidden" : ""} text-center`}>
                <h1 className={`text-4xl mb-8`}>
                    Write the prompt you want below
                </h1>
                <h1 className="text-3xl animate-bounce">👇</h1>
            </div>
            
            <MessageList messages={messages} />
            <InputPrompt onSendMessage={handleSendMessage} handleCancelRequest={handleCancelRequest} />
        </div>
    );
};

export default ChatApp;