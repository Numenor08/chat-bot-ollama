'use client';
import { ExitIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import Sidebar from "@/app/ui/Sidebar/Sidebar";

export default function SidebarWrapper() {
    const [isSideOpen, setIsSideOpen] = useState<boolean>(false);

    return (
        <>
            <Sidebar isSideOpen={isSideOpen} setIsSideOpen={setIsSideOpen} />

            <div className="fixed inset-0 z-20 bg-white w-full h-[3.75rem] flex items-center px-4">
                <ExitIcon
                    onClick={() => setIsSideOpen(!isSideOpen)} // Toggle Sidebar visibility
                    className={`w-6 h-6 cursor-pointer text-gray-500 hover:text-black transition-colors duration-300 ${isSideOpen ? 'hidden' : 'block'}`}
                />
            </div>
        </>
    )
}