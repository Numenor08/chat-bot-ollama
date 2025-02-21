"use client";

import ChatApp from "@/app/ui/chat-app";
import ApiRoute from "@/app/ui/api-route";
import { useState } from "react";
import ModelContext from "@/app/store/ContextProvider";

export default function Home() {
  const [model, setModel] = useState<string>("deepseek-r1");

  return (
    <ModelContext.Provider value={{ model, setModel }}>
      <main className="flex items-center justify-center h-screen w-screen">
        <ApiRoute />
        <ChatApp />
      </main>
    </ModelContext.Provider>
  );
}
