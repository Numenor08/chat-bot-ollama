"use client";

import { useState, useContext, useRef, useEffect, startTransition } from "react";
import MessageList from "@/app/ui/Message/Message";
import InputPrompt from "@/app/ui/InputPrompt";
import { Messages } from "@/app/types/types";
import ModelContext from "@/app/store/ContextProvider";
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
    const [messages, setMessages] = useState<Messages[]>([]);
    const lastUpdatedMessageRef = useRef<Messages[]>([]);
    const { setLoading, setIsThinking } = useContext(ModelContext);
    const [abortController, setAbortController] = useState<AbortController | null>(null);
    const reasoningTimeRef = useRef<number>(0);
    const reasoningTimerRef = useRef<NodeJS.Timeout | null>(null);
    const { threadId } = useParams();
    const router = useRouter();
    
    const handleCreateThread = async () => {
        const id = await db.createThread("New Chat2");
        return id;
    }
    
    const handleSendMessage = async (prompt: string, model: string, image: File | null) => {
        if (!prompt.trim()) return;
        
        // Convert image to Base64
        let imageBase64: string | null = null;
        if (image) {
            const compressedImage = await compressImage(image);
            imageBase64 = await convertImageToBase64(compressedImage);
        }

        let currentThreadId: string | string[] | undefined = threadId;
        
        if (!currentThreadId) {
            currentThreadId = await handleCreateThread();
        }
        
        await db.createMessage({
            thread_id: currentThreadId as string,
            role: 'user',
            content: prompt,
            image: imageBase64 ? [imageBase64] : null,
            reasoning_time: null         
        })
        const InputMessages: Messages = {role: 'user', content: prompt, images: imageBase64 ? [imageBase64] : null};
        
        const newMessages: Messages[] = [
            ...messages,
            InputMessages,
            { role: "assistant", content: "", reasoningTime: 0 }, // Placeholder bot dengan reasoningTime
        ];
        
        setMessages(newMessages);
        sendMessageToBackend(newMessages, model, currentThreadId);
    };

    const startReasoning = () => {
        setIsThinking(true);
        reasoningTimeRef.current = 0;
        reasoningTimerRef.current = setInterval(() => {
            reasoningTimeRef.current += 1;
        }, 1000);
    };

    const stopReasoning = (): number => {
        setIsThinking(false);
        if (reasoningTimerRef.current) {
            clearInterval(reasoningTimerRef.current);
        }
        return reasoningTimeRef.current;
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
                        const { content } = JSON.parse(line);
                        botReply += content;
                        
                        if (content && content.includes("<think>")) {
                            startReasoning();
                        }
                        
                        if (content && content.includes("</think>")) {
                            reasoningTime = stopReasoning();
                        }
                        
                        setMessages((prev) => {
                            return prev.map((msg, index) =>
                                index === assistantIndex
                            ? { ...msg, content: botReply, reasoningTime }
                            : msg
                        );
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
                    
                    // Save the last remainder message (Assistant) to the database
                    const reasoningTime = stopReasoning();
                    setMessages((prev) => {
                        return prev.map((msg, index) =>
                            index === prev.length - 1
                        ? { ...msg, reasoningTime }
                        : msg
                        );
                    })
                    
                    const remainderMessage = lastUpdatedMessageRef.current[lastUpdatedMessageRef.current.length - 1]; 
                    if (!remainderMessage) return;
                    await db.createMessage({
                        thread_id: currentThreadId as string,
                        role: 'assistant',
                        content: remainderMessage?.content,
                        image: null,
                        reasoning_time: reasoningTime
                    })
                    if (!threadId) {
                        window.history.replaceState(null, "", `/c/${currentThreadId}`);
                    }
                    return;
                }
                console.error("Error fetching response:", error);
            } else {
                console.error("Unknown error:", error);
            }
        } finally {
            setLoading(false);
            setAbortController(null);
            if (!threadId) {
                window.history.replaceState(null, "", `/c/${currentThreadId}`);
            }
        }
    };
    
    const handleCancelRequest = () => {
        if (abortController) {
            abortController.abort();
            setAbortController(null);
            setLoading(false);
            stopReasoning();
        }
    };

    useEffect(() => {

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (abortController) {
                e.preventDefault();
                handleCancelRequest();
                return '';
            }
        }

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const fetchMessages = async () => {
            const messages = await db.getMessagesByThreadId(threadId as string);
            setMessages(messages.map(msg => ({ ...msg, reasoningTime: msg.reasoning_time ?? undefined })));
        }
        if (threadId) {
            fetchMessages();
        }
    }, [threadId]);

    useEffect(() => {
        lastUpdatedMessageRef.current = messages;
    }, [messages]);

    return (
        <div className={`flex flex-col items-center ${messages.length > 0 ? "justify-between" : "justify-center"} h-screen py-8 w-full min-w-80 max-w-[50rem] gap-8`}>
            <h1 className={`text-4xl text-center ${messages.length > 0 ? "hidden" : ""}`}>
                Write the prompt you want below <span className="text-3xl">👇</span>
            </h1>
            <MessageList messages={messages} />
            <InputPrompt onSendMessage={handleSendMessage} handleCancelRequest={handleCancelRequest} />
        </div>
    );
};

export default ChatApp;