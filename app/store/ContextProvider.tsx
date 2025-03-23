// store/ContextProvider.tsx
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
    isDarkMode: boolean;
    handleIsDark: (value: boolean) => void;
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
    isDarkMode: false,
    handleIsDark: () => { },
});

export const ModelContextProvider = ({ children }: { children: ReactNode }) => {
    const [model, setModel] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [isThinking, setIsThinking] = useState<boolean>(false);
    const [isSideOpen, setIsSideOpen] = useState<boolean>(false);
    const [listModels, setListModels] = useState<models[] | null>(null);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [isReady, setIsReady] = useState<boolean>(false);

    const handleIsDark = (value: boolean) => {
        setIsDarkMode(value);
        localStorage.setItem('theme', value ? 'dark' : 'light');
    }

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const { models }: { models: models[] } = await ollama.list();
                models.sort((a, b) => a.name.localeCompare(b.name));
                setListModels(models);
                if (model === "") {
                    setModel(models[0].name);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        const getTheme = () => {
            if (!localStorage.getItem('theme')) {
                const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setIsDarkMode(darkModePreference);
                localStorage.setItem('theme', darkModePreference ? 'dark' : 'light');
            } else if (localStorage.getItem('theme') === 'dark') {
                setIsDarkMode(true);
            } else if (localStorage.getItem('theme') === 'light') {
                setIsDarkMode(false);
            }
        };

        const initializeApp = async () => {
            getTheme();
            await fetchModels();
            setIsReady(true);
        };

        initializeApp();
    }, []);

    if (!isReady) {
        return null;
    }

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
                isDarkMode,
                handleIsDark
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