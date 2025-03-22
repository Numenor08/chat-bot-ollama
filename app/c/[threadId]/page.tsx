"use client";

import ChatApp from "@/app/ui/ChatApp";
import Topbar from "@/app/ui/Topbar/Topbar";
import MainWrapper from "@/app/ui/MainWrapper";

export default function Home() {
    return (
        <MainWrapper>
            <Topbar />
            <ChatApp className="relative h-96 flex-auto flex flex-col items-center justify-between min-w-[24rem] w-full max-w-[47rem]"/>
        </MainWrapper>
    );
}