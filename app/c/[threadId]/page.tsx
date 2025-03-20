"use client";

import ChatApp from "@/app/ui/ChatApp";
import Topbar from "@/app/ui/Sidebar/Topbar";

export default function Home() {
    return (
        <div className="relative flex flex-col items-center w-full h-max-screen">
            <Topbar />
            <ChatApp className="relative h-96 flex-auto flex flex-col items-center justify-between min-w-[24rem] w-full max-w-[47rem] gap-0"/>
        </div>
    );
}