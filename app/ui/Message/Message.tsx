"use client";
import { useEffect, useRef, useState, useMemo, memo } from "react";
import { Message } from "@/app/types/types";
import ThoughtMessage from "@/app/ui/Message/ThoughtMessage";
import { ThreeDots } from "react-loader-spinner";
import Image from 'next/image'
import ChatMarkdown from "@/app/ui/Message/ChartMarkdown";
import { useModelContext } from "@/app/store/ContextProvider";

interface MessageItemProps {
    msg: Message;
    index: number;
    messages: Message[];
}

interface MessageListProps {
    previousMessages: Message[]; 
    className?: string;
    currentMessage: Message | null; 
    isPending: boolean; 
    hasError: boolean; 
}

const MessageItem = memo(({ msg, index, messages }: MessageItemProps) => {
    const renderContent = useMemo(() => {
        return (content: string, reasoningTime: number ) => {
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
                        />
                        {remainingContent && (
                            <ChatMarkdown className="prose text-black dark:prose-invert dark:text-light max-w-max text-sm/6 w-full" content={remainingContent} />
                        )}
                    </>
                );
            }
            return (
                <ChatMarkdown className="prose text-black dark:prose-invert dark:text-light max-w-max text-sm/6 w-full" content={content.trim()} />
            );
        };
    }, [index, messages]);
    if (!msg) return null;

    return (
        <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-2`}>
            <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} w-full`}>
                <div className={`break-words px-4 py-2 my-6 rounded-lg ${msg.role === "user" ? "bg-gray-100 dark:bg-darkChat max-w-[75%]" : "bg-none w-full"} animate-fade-in`}>
                    {msg.content && (
                        renderContent(msg.content, msg.reasoningTime || 0)
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
    );
});

const MessageList = memo(({ previousMessages, className, currentMessage, isPending, hasError }: MessageListProps) => {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isAutoScroll, setIsAutoScroll] = useState(true);
    const { isDarkMode } = useModelContext();

    useEffect(() => {
        if (isAutoScroll) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [previousMessages, currentMessage, isAutoScroll]);

    const handleScroll = () => {
        if (!containerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const isAtBottom = scrollHeight - scrollTop <= clientHeight + 48; // Buffer

        setIsAutoScroll(isAtBottom);
    };

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            className={`${className}`}
        >
            {previousMessages && previousMessages.map((msg, index) => (
                <MessageItem key={index} msg={msg} index={index} messages={previousMessages} />
            ))}
            {currentMessage && (
                <MessageItem
                    key="current"
                    msg={currentMessage}
                    index={previousMessages.length}
                    messages={[...previousMessages, currentMessage]}
                />
            )}
            {isPending && !hasError && (
                <div className="flex justify-start items-center px-4 py-2 my-8">
                    <ThreeDots color={`${isDarkMode ? '#ececec' : '#141414'}`} height={15} width={15} />
                </div>
            )}
            {hasError && (
                <div className="flex justify-start items-center px-4 py-2 my-8 rounded-lg text-red-500 bg-red-100 dark:text-white dark:bg-red-700">
                    Server Error!
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
});

export default MessageList;