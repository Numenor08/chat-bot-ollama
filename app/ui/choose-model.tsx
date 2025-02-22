"use client";
import { useEffect, useState, useContext } from "react";
import { TriangleDownIcon } from "@radix-ui/react-icons";
import ModelContext from "@/app/store/ContextProvider";

interface models {
    name: string;
    model: string;
    modified_at: string;
    size: number;
    digest: string;
    details: object;
}

const ChooseModel = () => {
    const [listModels, setListModels] = useState<models[] | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const { model, setModel } = useContext(ModelContext);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const res = await fetch("/api/chat/model");
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setListModels(data.models);
                setModel(data.models[0].name);
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };
        fetchModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelectClick = () => {
        setIsOpen(!isOpen);
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setModel(e.target.value);
    }

    return (
        <div className="fixed z-50 top-2 flex bg-white border overflow-y-auto border-gray-300 rounded-3xl shadow">
            <select
                className="appearance-none focus:outline-none p-3 pl-4 pr-10"
                onClick={handleSelectClick}
                onBlur={() => setIsOpen(false)}
                onChange={handleSelectChange}
                value={model}
            >
                {!listModels ? (
                    <option disabled>No models installed</option>
                ) : (
                    listModels.map((model, i) => (
                        <option value={model.name} key={i}>{model.name}</option>
                    ))
                )}
            </select>
            <TriangleDownIcon className={`w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
    );
};

export default ChooseModel;
