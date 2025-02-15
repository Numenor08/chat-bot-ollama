"use client";

import { useState } from "react";
import MessageList from "@/app/ui/message";
import InputPrompt from "@/app/ui/input-prompt";

const ChatApp = () => {
    const [messages, setMessages] = useState<{ role: string; text: string }[]>(
        [],
    );

    const handleSendMessage = async (prompt: string) => {
        if (!prompt.trim()) return;

        const userMessage = { role: "user", text: prompt };
        setMessages((prev) => [...prev, userMessage]);

        try {
            // Panggil API Next.js
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();

            if (data.message) {
                // Tangkap balasan dari server
                const botMessage = { role: "bot", text: data.message };
                setMessages((prev) => [...prev, botMessage]);
            }
        } catch (error) {
            console.error("Error fetching response:", error);
        }
    };

    return (
        <>
            <MessageList messages={messages} />
            <InputPrompt onSendMessage={handleSendMessage} />
        </>
    );
};
export default ChatApp;
