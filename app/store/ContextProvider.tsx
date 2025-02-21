import { createContext } from "react";

const ModelContext = createContext<{ model: string; setModel: (model: string) => void }>({
    model: "",
    setModel: () => {},
});

export default ModelContext;