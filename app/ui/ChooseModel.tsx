"use client";
import { useState } from "react";
import { TriangleDownIcon } from "@radix-ui/react-icons";
import { abel } from "@/app/fonts";
import { useModelContext } from "@/app/store/ContextProvider";

const ChooseModel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { model, setModel, listModels } = useModelContext();

    const handleSelectClick = () => {
        setIsOpen(!isOpen);
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setModel(e.target.value);
    }

    return (
        <div className={`${abel.className} absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-44 flex bg-white border overflow-y-auto overflow-x-hidden border-gray-300 rounded-3xl shadow`}>
            <select
                className="appearance-none focus:outline-none p-1 pl-4 pr-10"
                onClick={handleSelectClick}
                onBlur={() => setIsOpen(false)}
                onChange={handleSelectChange}
                value={model ? model : 'no-model'}
            >
                {!listModels ? (
                    <option value={'no-model'} disabled>No models installed</option>
                ) : (
                    listModels.map((model, i) => (
                        <option value={model.name} key={i}>{model.name}</option>
                    ))
                )}
            </select>
            <TriangleDownIcon className={`w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-75 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
    );
};

export default ChooseModel;
