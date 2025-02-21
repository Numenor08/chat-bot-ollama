import { createContext } from "react";

const ModelContext = createContext<{ model: string; setModel: (model: string) => void }>({
    model: "deepseek-r1",
    setModel: () => { },
});

export default ModelContext;