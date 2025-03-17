"use client";

import ChatApp from "@/app/ui/chat-app";
import ChooseModel from "@/app/ui/choose-model";
import { useState } from "react";
import ModelContext from "@/app/store/ContextProvider";
import Sidebar from "@/app/ui/Sidebar/Sidebar";
import { ExitIcon } from "@radix-ui/react-icons";

export default function Home() {
  const [model, setModel] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isSideOpen, setIsSideOpen] = useState<boolean>(false);

  return (
    <ModelContext.Provider
      value={{ model, setModel, loading, setLoading, isThinking, setIsThinking }}
    >
      <main className="flex h-screen w-screen">
        
        <Sidebar isSideOpen={isSideOpen} setIsSideOpen={setIsSideOpen} />

        <div className="relative flex flex-col items-center justify-center w-full h-full">
          <div className="bg-white w-full h-[3.75rem] flex items-center px-3">
          <ExitIcon
            onClick={() => setIsSideOpen(!isSideOpen)} // Toggle Sidebar visibility
            className={`w-6 h-6 cursor-pointer text-gray-500 hover:text-black transition-colors duration-300 ${isSideOpen ? 'hidden' : 'block'}`}
          />
          </div>
          <ChooseModel />
          <ChatApp />
        </div>

      </main>
    </ModelContext.Provider>
  );
}