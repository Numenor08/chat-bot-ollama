"use client";
import { useEffect, useRef, useState } from "react";

const MessageList = ({ messages }: { messages: { role: "user" | "bot"; text: string }[] }) => {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isAutoScroll, setIsAutoScroll] = useState(true);
    useEffect(() => {
        if (isAutoScroll) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isAutoScroll]);

    const handleScroll = () => {
        if (!containerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const isAtBottom = scrollHeight - scrollTop <= clientHeight + 10; // Buffer 10px agar tidak terlalu sensitif

        setIsAutoScroll(isAtBottom);
    };

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            className="w-full h-auto max-h-[36rem] overflow-y-auto p-4 message-area">
            {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-2`}>
                    <div className={`whitespace-pre-wrap break-words px-4 py-2 my-4 rounded-lg text-black ${msg.role === "user" ? "bg-neutral-200 max-w-[70%]" : "bg-none max-w-[80%] text-lg"} animate-fade-in`}>
                        {msg.text || <span className="animate-pulse">...</span>}
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;