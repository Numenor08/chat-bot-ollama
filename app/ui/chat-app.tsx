"use client";

import { useState } from "react";
import MessageList from "@/app/ui/message";
import InputPrompt from "@/app/ui/input-prompt";

const ChatApp = () => {
    const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([]);

    const handleSendMessage = async (prompt: string) => {
        if (!prompt.trim()) return;

        setMessages((prev) => [...prev, { role: "user", text: prompt }]);
        setMessages((prev) => [...prev, { role: "bot", text: "" }]); // Placeholder bot

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
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
                            updatedMessages[updatedMessages.length - 1] = { role: "bot", text: botReply };
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
