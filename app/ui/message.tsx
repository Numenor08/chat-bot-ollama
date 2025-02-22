"use client";
import { useEffect, useRef, useState } from "react";
import { Messages } from "@/app/types/types";
import ThoughtMessage from "@/app/ui/thought-message";
import { inter } from "@/app/fonts";
import { ThreeDots } from "react-loader-spinner";
import ReactMarkdown from "react-markdown";

const MessageList = ({ messages }: { messages: Messages[] }) => {
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
        const isAtBottom = scrollHeight - scrollTop <= clientHeight + 25; // Buffer 10px agar tidak terlalu sensitif

        setIsAutoScroll(isAtBottom);
    };

    const renderContent = (content: string) => {
        if (content.includes("<think>") && !content.includes("</think>")) {
            content += "</think>"; // Add the closing tag if it's missing
        }
        
        const thinkTagMatch = content.match(/<think>([\s\S]*?)<\/think>/);
        if (thinkTagMatch) {
            const thoughtContent = thinkTagMatch[1].trim();
            const remainingContent = content.replace(thinkTagMatch[0], '').trim();
            return (
                <>
                    <ThoughtMessage thought={thoughtContent} />
                    {remainingContent && (
                        <div className="prose text-sm/6">
                            <ReactMarkdown>{remainingContent}</ReactMarkdown>
                        </div>
                    )}
                </>
            );
        }
        return (
            <div className="prose text-sm/6">
                <ReactMarkdown>{content.trim()}</ReactMarkdown>
            </div>
        );
    };

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            className={`${inter.className} text-sm w-full h-auto max-h-[36rem] overflow-y-auto p-4 message-area`}>
            {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-2`}>
                    <div className={`break-words px-4 py-2 my-8 rounded-lg text-black ${msg.role === "user" ? "bg-gray-100 max-w-[70%]" : "bg-none max-w-[100%]"} animate-fade-in`}>
                        {msg.content ? (
                            renderContent(msg.content)
                        ) : (
                            <ThreeDots color="#141414" height={15} width={15} />
                        )}
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;