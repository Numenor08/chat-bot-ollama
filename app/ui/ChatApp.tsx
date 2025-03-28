"use client";

import { useState, useRef, useEffect } from "react";
import MessageList from "@/app/ui/Message/Message";
import InputPrompt from "@/app/ui/InputPrompt";
import { Message } from "@/app/types/types";
import { useModelContext } from "@/app/store/ContextProvider";
import { convertImageToBase64, compressImage } from "@/app/lib/image";
import { db } from "@/app/lib/dexie";
import { useParams, useRouter } from "next/navigation";
import ollama from 'ollama/browser'

const ChatApp = ({ className }: { className?: string }) => {
    const [previousMessages, setPreviousMessages] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [hasError, setHasError] = useState(false);
    const { setLoading, setIsThinking } = useModelContext();
    const { threadId } = useParams();
    const router = useRouter();
    const currentMessageRef = useRef<Message | null>(null);
    const startReasoning = useRef<number | null>(null);

    const handleCreateThread = async (title: string) => {
        const id = await db.createThread(title);
        return id;
    };

    const handleSendMessage = async (prompt: string, model: string, image: File | string | null) => {
        if (!prompt.trim()) return;

        let currentThreadId: string | string[] | undefined = threadId;
        let imageBase64: string | null = null;
        if (image) {
            if (image instanceof File) {
                const compressImageFile = await compressImage(image);
                imageBase64 = await convertImageToBase64(compressImageFile);
            } else {
                imageBase64 = image;
            }
        }
        const newTitle: string =
            prompt.trim().length > 28
                ? prompt.trim().slice(0, 1).toUpperCase() + prompt.trim().slice(1, 28) + "..."
                : prompt.trim().charAt(0).toUpperCase() + prompt.trim().slice(1);

        if (!currentThreadId) {
            localStorage.setItem("pendingPrompt", prompt);
            localStorage.setItem("pendingModel", model);
            if (imageBase64) {
                localStorage.setItem("pendingImage", imageBase64);
            }

            currentThreadId = await handleCreateThread(newTitle);
            router.push(`/c/${currentThreadId}`);
        } else {
            await db.createMessage({
                thread_id: currentThreadId as string,
                role: "user",
                content: prompt,
                images: imageBase64 ? [imageBase64] : null,
                reasoning_time: null,
            });

            const InputMessages: Message = { role: "user", content: prompt, images: imageBase64 ? [imageBase64] : [] };

            setPreviousMessages((prev) => [
                ...prev,
                InputMessages,
            ]);

            sendMessageToOllama([...previousMessages, InputMessages], model, currentThreadId);
        }
    };

    const sendMessageToOllama = async (updatedMessages: Message[], model: string, currentThreadId: string | string[]) => {
        try {
            setLoading(true);
            setIsPending(true);
            setHasError(false);

            const res = await ollama.chat({
                model: model,
                messages: updatedMessages,
                stream: true,
            });

            setIsPending(false);

            let botReply = "";
            let reasoningTime = 0;

            for await (const part of res) {
                if (part.message.content.includes("<think>")) {
                    startReasoning.current = Date.now();
                    setIsThinking(true);
                }
                if (part.message.content.includes("</think>")) {
                    const endReasoning = Date.now();
                    reasoningTime = Math.floor((endReasoning - startReasoning.current!) / 1000);
                    startReasoning.current = reasoningTime
                    setIsThinking(false);
                }
                botReply += part.message.content;

                setCurrentMessage((prev) => {
                    currentMessageRef.current = {
                        role: "assistant",
                        content: botReply,
                        reasoningTime: reasoningTime,
                    }
                    return currentMessageRef.current as Message;
                });
            }

            setPreviousMessages((prev) => [
                ...prev,
                currentMessageRef.current as Message,
            ]);
            await db.createMessage({
                thread_id: currentThreadId as string,
                role: "assistant",
                content: botReply,
                reasoning_time: startReasoning.current,
            });

            setCurrentMessage(null);
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === "AbortError") {
                    const endReasoningTime = Date.now();
                    const clientReasoningTime = Math.floor((endReasoningTime - startReasoning.current!) / 1000);
                    console.warn("Request was aborted");
                    setCurrentMessage(null);
                    if (currentMessageRef.current) {
                        const remainderMessage: Message = currentMessageRef.current;
                        const newReasoningTime = remainderMessage.reasoningTime ? remainderMessage.reasoningTime : clientReasoningTime;
                        remainderMessage.reasoningTime = newReasoningTime;
                        setPreviousMessages((prev) => [...prev, remainderMessage]);
                        await db.createMessage({
                            thread_id: currentThreadId as string,
                            role: 'assistant',
                            content: remainderMessage.content,
                            images: null,
                            reasoning_time: remainderMessage.reasoningTime,
                        });
                    }
                    return;
                }
                console.error("Error fetching response:", error);
            } else {
                console.error("Unknown error:", error);
                setHasError(true);
            }
        } finally {
            setLoading(false);
            startReasoning.current = null;
        }
    };

    const handleCancelRequest = () => {
        ollama.abort();
        setIsPending(false);
        setLoading(false);
        setIsThinking(false);
    };

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const fetchedMessages = await db.getMessagesByThreadId(threadId as string);
                setPreviousMessages(fetchedMessages.map((msg) => ({ ...msg, reasoningTime: msg.reasoning_time ?? undefined })) as Message[]);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        if (threadId) {
            fetchMessages();
        }
    }, [threadId]);

    useEffect(() => {
        const makeFirstRequest = async () => {
            if (threadId && previousMessages.length === 0) {
                const prompt = localStorage.getItem("pendingPrompt");
                const model = localStorage.getItem("pendingModel");
                const imageBase64 = localStorage.getItem("pendingImage") || null;

                localStorage.removeItem("pendingPrompt");
                localStorage.removeItem("pendingModel");
                localStorage.removeItem("pendingImage");

                if (prompt && model) {
                    handleSendMessage(prompt, model, imageBase64);
                }
            }
        };

        makeFirstRequest();
    }, [threadId, previousMessages]);

    useEffect(() => {
        return () => {
            handleCancelRequest();
        };
    }, [])

    return (
        <div className={`${className} `}>
            <MessageList
                className="text-sm w-full h-full overflow-y-auto px-4 sidebar-custom"
                previousMessages={previousMessages}
                currentMessage={currentMessage}
                isPending={isPending}
                hasError={hasError}
            />
            <InputPrompt onSendMessage={handleSendMessage} handleCancelRequest={handleCancelRequest} />
        </div>
    );
};

export default ChatApp;