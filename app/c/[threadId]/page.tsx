"use client";

import ChatApp from "@/app/ui/ChatApp";
import Topbar from "@/app/ui/Sidebar/Topbar";
import ChatSuspense from "@/app/ui/ChatSuspense";
import { Suspense } from "react";

export default function Home() {
    return (
        <div className="relative flex flex-col items-center justify-center w-full w-max-screen h-full">
            <Topbar />
            <div className="px-4 pb-6 flex items-center justify-center w-full h-full">
                <div className="flex flex-col items-center h-full min-w-[24rem] w-full max-w-[47rem] gap-0">
                    <Suspense fallback={<ChatSuspense />}>
                        <ChatApp />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}