"use client";

import ChatApp from "@/app/ui/ChatApp";
import Topbar from "@/app/ui/Sidebar/Topbar";

export default function Home() {
  const bgWhite: string = 'bg-[url(/bg-white.jpg)] bg-fixed bg-cover bg-center before:content-[""] before:absolute before:inset-0 before:bg-white before:opacity-90';
    
    return (
        <div className={`${bgWhite} relative flex flex-col items-center w-full h-max-screen`}>
            <Topbar />
            <ChatApp className="relative h-96 flex-auto flex flex-col items-center justify-between min-w-[24rem] w-full max-w-[47rem]"/>
        </div>
    );
}