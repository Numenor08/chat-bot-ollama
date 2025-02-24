"use client";
import { useEffect, useRef, useState, useContext } from "react";
import { Messages } from "@/app/types/types";
import ThoughtMessage from "@/app/ui/thought-message";
import { inter } from "@/app/fonts";
import { ThreeDots } from "react-loader-spinner";
import ReactMarkdown from "react-markdown";
import ModelContext from "@/app/store/ContextProvider";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { CopyIcon } from "@radix-ui/react-icons";

const ChatMarkdown = ({ content, className }: { content: string, className: string }) => {
    return (
        <div className={className}>
            <ReactMarkdown
                components={{
                    pre({ children }) {
                        return (
                            <div className={`not-prose m-0`}>
                                {children}
                            </div>
                        );
                    },
                    code({ inline, className, children, ...props }: { inline?: boolean, className?: string, children?: React.ReactNode }) {
                        const match = /language-(\w+)/.exec(className || '');
                        console.log(typeof children);
                        return !inline && match ? (
                            <>
                                <div className="bg-[#50505a] text-gray-400 mb-0 rounded-t-xl px-4 py-2 flex items-center justify-between">
                                    <p className="hover:text-gray-200">{match[1]}</p>
                                    <CopyIcon className="w-4 h-4 ml-2 cursor-pointer hover:text-white" onClick={() => navigator.clipboard.writeText(String(children))} />
                                </div>
                                <SyntaxHighlighter
                                    customStyle={{
                                        overflow: "auto",
                                        borderTopLeftRadius: "0rem",
                                        borderTopRightRadius: "0rem",
                                        borderBottomLeftRadius: "0.75rem",
                                        borderBottomRightRadius: "0.75rem",
                                        marginTop: 0,
                                        scrollbarWidth: "thin",
                                        scrollbarColor: "rgba(131, 131, 131, 0.5) transparent",
                                    }}
                                    style={dracula}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}>
                                    {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                            </>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        )
                    }
                }}>
                {content}
            </ReactMarkdown>
        </div>
    );
}

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
            className={`${inter.className} text-sm w-full h-auto max-h-[36rem] overflow-y-auto p-4 message-area`}>
            {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-2`}>
                    <div className={`break-words px-4 py-2 my-8 rounded-lg text-black ${msg.role === "user" ? "bg-gray-100 max-w-[80%]" : "bg-none max-w-[90%]"} animate-fade-in`}>
                        {msg.content ? (
                            renderContent(msg.content, msg?.reasoningTime, index)
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