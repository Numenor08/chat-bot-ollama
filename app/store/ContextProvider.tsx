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
    abortController: AbortController | null;
    setAbortController: React.Dispatch<React.SetStateAction<AbortController | null>>;
    isSideOpen: boolean;
    setIsSideOpen: (value: boolean) => void;
}

export const ModelContext = createContext<ModelContextProps>({
    model: "",
    setModel: () => { },
    loading: false,
    setLoading: () => { },
    isThinking: false,
    setIsThinking: () => { },
    abortController: new AbortController(),
    setAbortController: () => { },
    isSideOpen: false,
    setIsSideOpen: () => { },
});

export const ModelContextProvider = ({ children }: { children: ReactNode }) => {
    const [model, setModel] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [isThinking, setIsThinking] = useState<boolean>(false);
    const [abortController, setAbortController] = useState<AbortController | null>(null);
    const [isSideOpen, setIsSideOpen] = useState<boolean>(false);

    return (
        <ModelContext.Provider
            value={{ model, setModel, loading, setLoading, isThinking, setIsThinking, abortController, setAbortController, isSideOpen, setIsSideOpen }}
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