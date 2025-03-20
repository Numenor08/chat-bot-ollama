'use client';

import { useState, ReactNode, useContext, useEffect } from "react";
import { createContext } from "react";
import ollama from "ollama/browser";

interface models {
    name: string;
    model: string;
    modified_at: Date;
    size: number;
    digest: string;
    details: object;
}

interface ModelContextProps {
    model: string;
    setModel: (model: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    isThinking: boolean;
    setIsThinking: (thinking: boolean) => void;
    isSideOpen: boolean;
    setIsSideOpen: (value: boolean) => void;
    listModels: models[] | null;
    setListModels: React.Dispatch<React.SetStateAction<models[] | null>>;
}

export const ModelContext = createContext<ModelContextProps>({
    model: "",
    setModel: () => { },
    loading: false,
    setLoading: () => { },
    isThinking: false,
    setIsThinking: () => { },
    isSideOpen: false,
    setIsSideOpen: () => { },
    listModels: null,
    setListModels: () => { },
});

export const ModelContextProvider = ({ children }: { children: ReactNode }) => {
    const [model, setModel] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [isThinking, setIsThinking] = useState<boolean>(false);
    const [isSideOpen, setIsSideOpen] = useState<boolean>(false);
    const [listModels, setListModels] = useState<models[] | null>(null);
    useEffect(() => {
            const fetchModels = async () => {
                try {
                    const { models }: {models: models[]} = await ollama.list();
                    setListModels(models);
                    if (model === "") {
                        setModel(models[0].name);
                    }
                } catch (error) {
                    console.error("Fetch error:", error);
                }
            };
            fetchModels();
        }, []);

    return (
        <ModelContext.Provider
            value={{
                model,
                setModel,
                loading,
                setLoading,
                isThinking,
                setIsThinking,
                isSideOpen,
                setIsSideOpen,
                listModels,
                setListModels,
            }}
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