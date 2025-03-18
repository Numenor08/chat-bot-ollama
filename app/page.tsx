"use client";

import ChatApp from "@/app/ui/chat-app";
import ChooseModel from "@/app/ui/choose-model";
import { useState } from "react";
import ModelContext from "@/app/store/ContextProvider";

export default function Home() {
  const [model, setModel] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);

  return (
    <ModelContext.Provider
      value={{ model, setModel, loading, setLoading, isThinking, setIsThinking }}
    >

      <div className="relative flex flex-col items-center justify-center w-full h-full px-4">
        <ChooseModel />
        <ChatApp />
      </div>

    </ModelContext.Provider>
  );
}