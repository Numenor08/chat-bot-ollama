"use client";

import ChatApp from "@/app/ui/chat-app";
import ChooseModel from "@/app/ui/choose-model";
import { useState } from "react";
import ModelContext from "@/app/store/ContextProvider";

export default function Home() {
  const [model, setModel] = useState<string>("");
  
  return (
    <ModelContext.Provider value={{ model, setModel }}>
      <main className="flex items-center justify-center h-screen w-screen">
        <ChooseModel />
        <ChatApp />
      </main>
    </ModelContext.Provider>
  );
}
