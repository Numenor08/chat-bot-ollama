"use client";
import { useState } from "react";
import { TriangleDownIcon } from "@radix-ui/react-icons";
import { abel } from "@/app/fonts";
import { useModelContext } from "@/app/store/ContextProvider";
import { DropdownMenu, DropdownItem } from "@/app/ui/Dropdown";

const ChooseModel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { model, setModel, listModels } = useModelContext();

    const handleSelectClick = () => {
        setIsOpen(!isOpen);
    };

    const handleSelectModel = (name: string) => {
        setModel(name);
        setIsOpen(false);
    }

    return (
        <>
            <button
                onClick={handleSelectClick}
                className={`${abel.className} text-nowrap text-lg text-neutral-700 dark:text-neutral-400 z-20 cursor-pointer absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-min flex bg-transparant hover:bg-gray-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-light overflow-y-auto overflow-x-hidden rounded-lg transition-colors duration-150`}>
                <div className="p-1 pl-4 pr-10">
                    {listModels ? model : 'No Model Installed'}
                </div>
                <TriangleDownIcon className={`w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-75 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <>
                    <DropdownMenu className="absolute text-neutral-700 dark:text-light top-12 left-1/2 transform -translate-x-1/2 font-mono text-sm w-min max-h-40 flex border overflow-y-auto bg-white dark:bg-darkChat dark:border-neutral-700  rounded-md p-1 z-20 ">
                        {listModels?.map((model, i) => (
                            <DropdownItem className="text-nowrap transition-colors duration-100 dark:hover:bg-neutral-700" key={i} onClick={() => handleSelectModel(model.name)}>{model.name}</DropdownItem>
                        ))}
                    </DropdownMenu>
                    <div
                        className={`fixed inset-0 bg-transparent z-10 ${isOpen ? "opacity-30" : "opacity-0 hidden pointer-events-none"
                            }`}
                        onClick={() => setIsOpen(false)}></div>
                </>
            )}
        </>
    );
};

export default ChooseModel;
