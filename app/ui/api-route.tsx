"use client";

import { useState } from "react";
import { Pencil1Icon } from "@radix-ui/react-icons";

const ApiRoute = () => {
    const [apiRoute, setApiRoute] = useState<string>("localhost:11434");

    const handleIconClick = () => {
        const newApiRoute = prompt("Enter new API route:", apiRoute);
        if (newApiRoute) {
            setApiRoute(newApiRoute);
        }
    };

    return (
        <div className="fixed flex items-center gap-1 top-0 bg-sky-100 rounded-b-xl py-2 px-4">
            <p>🤖</p>
            <p>{apiRoute}</p>
            <Pencil1Icon className="opacity-30 hover:cursor-pointer hover:opacity-80" onClick={handleIconClick} />
        </div>
    );
};

export default ApiRoute;
