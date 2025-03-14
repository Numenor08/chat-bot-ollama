"use client";
import { useEffect, useRef, useState, useContext } from "react";
import { Messages } from "@/app/types/types";
import ThoughtMessage from "@/app/ui/thought-message";
import { ThreeDots } from "react-loader-spinner";
import ModelContext from "@/app/store/ContextProvider";
import Image from 'next/image'
import ChatMarkdown from "@/app/ui/chat-markdown";

const MessageList = ({ messages }: { messages: Messages[] }) => {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isAutoScroll, setIsAutoScroll] = useState(true);
    const { isThinking } = useContext(ModelContext);

    useEffect(() => {
        if (isAutoScroll) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isAutoScroll]);

    const handleScroll = () => {
        if (!containerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const isAtBottom = scrollHeight - scrollTop <= clientHeight + 12; // Buffer 12px

        setIsAutoScroll(isAtBottom);
    };

    const renderContent = (content: string, reasoningTime: number = 0, index: number) => {
        if (content.includes("<think>") && !content.includes("</think>")) {
            content += "</think>";
        }

        const thinkTagMatch = content.match(/<think>([\s\S]*?)<\/think>/);
        if (thinkTagMatch) {
            const thoughtContent = thinkTagMatch[1].trim();
            const remainingContent = content.replace(thinkTagMatch[0], '').trim();
            return (
                <>
                    <ThoughtMessage
                        reasoningTime={reasoningTime}
                        thought={thoughtContent}
                        isActive={index === messages.length - 1 && isThinking}
                    />
                    {remainingContent && (
                        <ChatMarkdown className="prose text-sm/6 w-full" content={remainingContent} />
                    )}
                </>
            );
        }
        return (
            <ChatMarkdown className="prose text-sm/6 w-full" content={content.trim()} />
        );
    };

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            className={`text-sm w-full h-auto max-h-[36rem] overflow-y-auto p-4 message-area`}>
            {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-2`}>
                    <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                        <div className={`break-words px-4 py-2 my-8 rounded-lg text-black ${msg.role === "user" ? "bg-gray-100 max-w-[80%]" : "bg-none max-w-[90%]"} animate-fade-in`}>
                            {msg.content ? (
                                renderContent(msg.content, msg?.reasoningTime, index)
                            ) : (
                                <ThreeDots color="#141414" height={15} width={15} />
                            )}
                        </div>
                            {msg.images && msg.images.length > 0 && (
                                <Image
                                src={`data:image/png;base64,${msg.images[0]}`}
                                width={240}
                                height={200}
                                alt={`Image ${index}`}
                                className="rounded-md w-auto max-w-80 max-h-60"
                                />
                            )}
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;