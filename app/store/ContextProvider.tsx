import { createContext } from "react";

const ModelContext = createContext<{
    model: string;
    setModel: (model: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    isThinking: boolean;
    setIsThinking: (thinking: boolean) => void;
}>({
    model: "",
    setModel: () => {},
    loading: false,
    setLoading: () => {},
    isThinking: false,
    setIsThinking: () => {},
});

export default ModelContext;