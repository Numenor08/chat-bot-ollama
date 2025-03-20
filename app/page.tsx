"use client";

import ChatApp from "@/app/ui/ChatApp";
import Topbar from "@/app/ui/Sidebar/Topbar";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full">
      <Topbar />
      <div className="px-4 pb-6 flex items-center justify-center w-full h-full">
        <div className="relative flex flex-col items-center justify-center py-8 w-full min-w-80 max-w-[50rem] gap-8">
          <div className={`text-center`}>
            <h1 className={`text-4xl mb-8`}>
              Write the prompt you want below
            </h1>
            <h1 className="text-3xl animate-bounce">👇</h1>
          </div>
          <ChatApp className="w-full" />
        </div>
      </div>
    </div>
  );
}