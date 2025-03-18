'use client';

import { useState, ReactNode, useContext } from "react";
import { createContext } from "react";
import { Messages } from "@/app/types/types";

interface ModelContextProps {
    model: string;
    setModel: (model: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    isThinking: boolean;
    setIsThinking: (thinking: boolean) => void;
    messages: Messages[];
    setMessages: React.Dispatch<React.SetStateAction<Messages[]>>;
    abortController: AbortController | null;
    setAbortController: React.Dispatch<React.SetStateAction<AbortController | null>>;
}

export const ModelContext = createContext<ModelContextProps>({
    model: "",
    setModel: () => { },
    loading: false,
    setLoading: () => { },
    isThinking: false,
    setIsThinking: () => { },
    messages: [],
    setMessages: () => { },
    abortController: new AbortController(),
    setAbortController: () => { },
});

export const ModelContextProvider = ({ children }: { children: ReactNode }) => {
    const [model, setModel] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [isThinking, setIsThinking] = useState<boolean>(false);
    const [messages, setMessages] = useState<Messages[]>([]);
    const [abortController, setAbortController] = useState<AbortController | null>(null);

    return (
        <ModelContext.Provider
            value={{ model, setModel, loading, setLoading, isThinking, setIsThinking, messages, setMessages, abortController, setAbortController }}
        >

            {children}

        </ModelContext.Provider>
    );
}

export const useModelContext = () => {
    const context = useContext(ModelContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}