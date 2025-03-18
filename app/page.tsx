"use client";

import ChatApp from "@/app/ui/ChatApp";
import ChooseModel from "@/app/ui/ChooseModel";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full px-4">
      <ChooseModel />
      <ChatApp />
    </div>
  );
}