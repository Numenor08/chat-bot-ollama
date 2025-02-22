"use client";

import { useState, useContext, useRef } from "react";
import MessageList from "@/app/ui/message";
import InputPrompt from "@/app/ui/input-prompt";
import { Messages } from "@/app/types/types";
import ModelContext from "@/app/store/ContextProvider";

const ChatApp = () => {
    const [messages, setMessages] = useState<Messages[]>([]);
    const { setLoading, setIsThinking } = useContext(ModelContext);
    const [abortController, setAbortController] = useState<AbortController | null>(null);
    const reasoningTimerRef = useRef<NodeJS.Timeout | null>(null);

    const handleSendMessage = async (prompt: string, model: string) => {
        if (!prompt.trim()) return;

        const newMessages: Messages[] = [
            ...messages,
            { role: "user", content: prompt },
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

                        if (content.includes("<think>")) {
                            startReasoning(assistantIndex);
                        }

                        if (content.includes("</think>")) {
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
        <div className="flex flex-col items-center justify-center h-screen w-[90%] min-w-80 max-w-[50rem] gap-8">
            <h1 className={`text-4xl text-center ${messages.length > 0 ? "hidden" : ""}`}>
                Write the prompt you want below <span className="text-3xl">👇</span>
            </h1>
            <MessageList messages={messages} />
            <InputPrompt onSendMessage={handleSendMessage} handleCancelRequest={handleCancelRequest} />
        </div>
    );
};

export default ChatApp;
