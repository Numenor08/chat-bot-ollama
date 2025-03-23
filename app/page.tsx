"use client";

import ChatApp from "@/app/ui/ChatApp";
import Topbar from "@/app/ui/Topbar/Topbar";
import Image from "next/image";
import { poppins } from "@/app/fonts";
import MainWrapper from "@/app/ui/MainWrapper";
import { useModelContext } from "@/app/store/ContextProvider";

export default function Home() {
  const { isDarkMode } = useModelContext();

  return (
    <MainWrapper>
      <Topbar />
      <div className="px-4 flex items-center justify-center w-full h-full">
        <div className="relative flex flex-col items-center justify-center my-8 w-full min-w-80 max-w-[50rem] gap-12">
          <div className="flex flex-col items-center justify-center gap-4">
            {isDarkMode ? (
              <Image src="/ollama-black.png" width={130} height={130} className="max-sm:w-24" alt="Ollama White Logo" />
            ) : (

              <Image src="/ollama-white.png" width={130} height={130} className="max-sm:w-24" alt="Ollama White Logo" />
            )}
            <h1 className={`${poppins.className} text-black dark:text-light tracking-tight text-center font-medium sm:text-4xl text-2xl max-sm:px-2`}>
              How can I help you today?
            </h1>
          </div>
          <ChatApp className="w-full" />
        </div>
      </div>
    </MainWrapper>
  );
}