"use client";

import ChatApp from "@/app/ui/ChatApp";
import Topbar from "@/app/ui/Sidebar/Topbar";
import Image from "next/image";
import { poppins } from "@/app/fonts";

export default function Home() {
  const bgWhite: string = 'bg-[url(/bg-white.jpg)] bg-fixed bg-cover bg-center before:content-[""] before:absolute before:inset-0 before:bg-white before:opacity-90';

  return (
    <div className={`${bgWhite} relative flex flex-col items-center justify-center w-full h-full`}>
      <Topbar />
      <div className="px-4 pb-6 flex items-center justify-center w-full h-full">
        <div className="relative flex flex-col items-center justify-center py-8 w-full min-w-80 max-w-[50rem] gap-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <Image src="/ollama-white.png" width={130} height={130} className="max-sm:w-24" alt="Ollama White Logo" />
            <h1 className={`${poppins.className} tracking-tight text-center font-medium sm:text-4xl text-2xl max-sm:px-2`}>
              How can I help you today?            
            </h1>
          </div>
          <ChatApp className="w-full" />
        </div>
      </div>
    </div>
  );
}