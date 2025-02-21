"use client";

import { useState } from "react";
import MessageList from "@/app/ui/message";
import InputPrompt from "@/app/ui/input-prompt";
import { Messages } from "@/app/types/types"

const ChatApp = () => {
    const [messages, setMessages] = useState<Messages[]>([]);
    console.log(messages);
    const handleSendMessage = async (prompt: string, model: string) => {
        if (!prompt.trim()) return;

        const newMessage: Messages = { role: "user", content: prompt };

        setMessages((prev) => {
            const updatedMessages: Messages[] = [...prev, newMessage];
            sendMessageToBackend(updatedMessages, model);
            return updatedMessages;
        });

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]); // Placeholder bot
    };

    const sendMessageToBackend = async (updatedMessages: Messages[], model: string) => {
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: updatedMessages, model }),
            });

            if (!res.body) throw new Error("Something went wrong");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let botReply = "";

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
                        setMessages((prev) => {
                            const updatedMessages = [...prev];
                            updatedMessages[updatedMessages.length - 1] = { role: "assistant", content: botReply };
                            return updatedMessages;
                        });
                    } catch (error) {
                        console.error("Error parsing JSON:", error);
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching response:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen w-[80%] min-w-80 max-w-[48rem] gap-8">
            <h1 className={`text-4xl text-center ${messages.length > 0 ? "hidden" : ""}`}>Write the prompt you want below <span className="text-3xl">👇</span></h1>
            <MessageList messages={messages} />
            <InputPrompt onSendMessage={handleSendMessage} />
        </div>
    );
};

export default ChatApp;