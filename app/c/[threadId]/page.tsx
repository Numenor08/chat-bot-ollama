"use client";

import Topbar from "@/app/ui/Topbar/Topbar";
import MainWrapper from "@/app/ui/MainWrapper";
import { lazy, Suspense } from "react";
import ChatSuspense from "@/app/ui/ChatSuspense";
const ChatApp = lazy(() => import("@/app/ui/ChatApp"));

export default function Home() {
    return (
        <MainWrapper>
            <Topbar />
            <Suspense fallback={<ChatSuspense />}>
                <ChatApp className="relative h-0 flex-1 flex flex-col items-center justify-between w-full max-w-[47rem] mb-8"/>
            </Suspense>
        </MainWrapper>
    );
}