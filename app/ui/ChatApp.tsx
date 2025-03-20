"use client";

import { useState, useRef, useEffect } from "react";
import MessageList from "@/app/ui/Message/Message";
import InputPrompt from "@/app/ui/InputPrompt";
import { Messages } from "@/app/types/types";
import { useModelContext } from "@/app/store/ContextProvider";
import { db } from "@/app/lib/dexie";
import { useParams, useRouter } from "next/navigation";

const ChatApp = () => {
    const [previousMessages, setPreviousMessages] = useState<Messages[]>([]);
    const [currentMessage, setCurrentMessage] = useState<Messages | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [hasError, setHasError] = useState(false);
    const { setLoading, setIsThinking, abortController, setAbortController } = useModelContext();
    const { threadId } = useParams();
    const router = useRouter();
    const currentMessageRef = useRef<Messages | null>(null);
    const startReasoning = useRef<number | null>(null);

    const handleCreateThread = async (title: string) => {
        const id = await db.createThread(title);
        return id;
    };

    const handleSendMessage = async (prompt: string, model: string, image: File | string | null) => {
        if (!prompt.trim()) return;

        let currentThreadId: string | string[] | undefined = threadId;
        const newTitle: string =
            prompt.trim().length > 20
                ? prompt.trim().slice(0, 1).toUpperCase() + prompt.trim().slice(1, 20) + "..."
                : prompt.trim().charAt(0).toUpperCase() + prompt.trim().slice(1);

        if (!currentThreadId) {
            localStorage.setItem("pendingPrompt", prompt);
            localStorage.setItem("pendingModel", model);
            if (image) {
                localStorage.setItem("pendingImage", image as string);
            }

            currentThreadId = await handleCreateThread(newTitle);
            router.push(`/c/${currentThreadId}`);
        } else {
            await db.createMessage({
                thread_id: currentThreadId as string,
                role: "user",
                content: prompt,
                image: image ? [image as string] : null,
                reasoning_time: null,
            });

            const InputMessages: Messages = { role: "user", content: prompt, image: image ? [image as string] : null };

            setPreviousMessages((prev) => [
                ...prev,
                InputMessages,
            ]);

            sendMessageToBackend([...previousMessages, InputMessages], model, currentThreadId);
        }
    };

    const sendMessageToBackend = async (updatedMessages: Messages[], model: string, currentThreadId: string | string[]) => {
        try {
            setLoading(true);
            setIsPending(true);
            setHasError(false);

            const controller = new AbortController();
            setAbortController(controller);

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: updatedMessages, model }),
                signal: controller.signal,
            });

            if (!res.body) throw new Error("Something went wrong");
            setIsPending(false);
            startReasoning.current = Date.now();

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let botReply = "";
            let reasoningTime = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const textChunk = decoder.decode(value, { stream: true });
                const lines = textChunk.trim().split("\n");

                for (const line of lines) {
                    if (!line) continue;

                    try {
                        const parsedData = JSON.parse(line);
                        const { content, reasoningTime: newReasoningTime } = parsedData;
                        botReply += content;

                        reasoningTime = newReasoningTime;
                        setCurrentMessage((prev) => {
                            currentMessageRef.current = {
                                role: "assistant",
                                content: botReply,
                                reasoningTime: reasoningTime,
                            };
                            return currentMessageRef.current;
                        });

                        if (content.includes("<think>")) { setIsThinking(true) }

                        if (content.includes("</think>")) { setIsThinking(false) }

                    } catch (error) {
                        console.error("Error parsing JSON:", error);
                    }
                }
            }

            setPreviousMessages((prev) => [
                ...prev,
                currentMessageRef.current as Messages,
            ]);
            await db.createMessage({
                thread_id: currentThreadId as string,
                role: "assistant",
                content: botReply,
                reasoning_time: reasoningTime,
            });
            
            setCurrentMessage(null);
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === "AbortError") {
                    const endReasoningTime = Date.now();
                    const clientReasoningTime = Math.floor((endReasoningTime - startReasoning.current!) / 1000);
                    console.warn("Request was aborted");
                    if (currentMessageRef.current) {
                        const remainderMessage: Messages = currentMessageRef.current;
                        const newReasoningTime = remainderMessage.reasoningTime ? remainderMessage.reasoningTime : clientReasoningTime;
                        remainderMessage.reasoningTime = newReasoningTime;
                        setPreviousMessages((prev) => [...prev, remainderMessage]);
                        await db.createMessage({
                            thread_id: currentThreadId as string,
                            role: 'assistant',
                            content: remainderMessage.content,
                            image: null,
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
            setAbortController(null);
            startReasoning.current = null;
        }
    };

    const handleCancelRequest = () => {
        if (abortController) {
            abortController.abort();
            setAbortController(null);
            setIsPending(false);
            setLoading(false);
            setIsThinking(false);
            setCurrentMessage(null);
        }
    };

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const fetchedMessages = await db.getMessagesByThreadId(threadId as string);
                setPreviousMessages(fetchedMessages.map((msg) => ({ ...msg, reasoningTime: msg.reasoning_time ?? undefined })) as Messages[]);
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
            if (abortController) {
                handleCancelRequest();
            }
        };
    }, [])

    return (
        <>
            <MessageList
                previousMessages={previousMessages}
                currentMessage={currentMessage}
                isPending={isPending}
                hasError={hasError}
            />
            <InputPrompt onSendMessage={handleSendMessage} handleCancelRequest={handleCancelRequest} />
        </>
    );
};

export default ChatApp;