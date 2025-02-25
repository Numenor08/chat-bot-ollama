"use client";

import { useState, useContext, useRef } from "react";
import MessageList from "@/app/ui/message";
import InputPrompt from "@/app/ui/input-prompt";
import { Messages } from "@/app/types/types";
import ModelContext from "@/app/store/ContextProvider";

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
    const { setLoading, setIsThinking } = useContext(ModelContext);
    const [abortController, setAbortController] = useState<AbortController | null>(null);
    const reasoningTimerRef = useRef<NodeJS.Timeout | null>(null);
    
    const handleSendMessage = async (prompt: string, model: string, image: File | null) => {
        if (!prompt.trim()) return;
        
        // Convert image to Base64
        let imageBase64: string | null = null;
        if (image) {
            const compressedImage = await compressImage(image);
            imageBase64 = await convertImageToBase64(compressedImage);
        }
        
        const newMessages: Messages[] = [
            ...messages,
            { role: "user", content: prompt, images: imageBase64 ? [imageBase64] : null },
            { role: "assistant", content: "", reasoningTime: 0 }, // Placeholder bot dengan reasoningTime
        ];

        setMessages(newMessages);
        sendMessageToBackend(newMessages, model);
    };

    const startReasoning = (index: number) => {
        setIsThinking(true);
        reasoningTimerRef.current = setInterval(() => {
            setMessages((prev) => {
                const updatedMessages = [...prev];
                updatedMessages[index].reasoningTime = (updatedMessages[index].reasoningTime || 0) + 1;
                return updatedMessages;
            });
        }, 1000);
    };

    const stopReasoning = () => {
        setIsThinking(false);
        if (reasoningTimerRef.current) {
            clearInterval(reasoningTimerRef.current);
        }
    };

    const sendMessageToBackend = async (updatedMessages: Messages[], model: string) => {
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
                            startReasoning(assistantIndex);
                        }

                        if (content && content.includes("</think>")) {
                            stopReasoning();
                        }

                        setMessages((prev) => {
                            return prev.map((msg, index) =>
                                index === assistantIndex
                                    ? { ...msg, content: botReply }
                                    : msg
                            );
                        });
                    } catch (error) {
                        console.error("Error parsing JSON:", error);
                    }
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === "AbortError") {
                    console.log("Request was aborted");
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
            stopReasoning();
        }
    };

    return (
        <div className={`flex flex-col items-center ${messages.length > 0 ? "justify-between" : "justify-center"} h-screen py-8 w-[90%] min-w-80 max-w-[50rem] gap-8`}>
            <h1 className={`text-4xl text-center ${messages.length > 0 ? "hidden" : ""}`}>
                Write the prompt you want below <span className="text-3xl">👇</span>
            </h1>
            <MessageList messages={messages} />
            <InputPrompt onSendMessage={handleSendMessage} handleCancelRequest={handleCancelRequest} />
        </div>
    );
};

export default ChatApp;