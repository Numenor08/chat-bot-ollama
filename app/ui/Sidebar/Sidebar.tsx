"use client";

import SideChat from "@/app/ui/Sidebar/SideChat";
import { EnterIcon } from "@radix-ui/react-icons";
import { db, Thread } from "@/app/lib/dexie";
import { useLiveQuery } from "dexie-react-hooks";
import NewChatButton from "../NewChatButton";

interface SidebarProps {
  isSideOpen: boolean;
  setIsSideOpen: (value: boolean) => void;
}

function Sidebar({ isSideOpen, setIsSideOpen }: SidebarProps) {
  
  const threads: Thread[] = useLiveQuery(() => db.getAllThreads(), []) || []

  return (
    <>
      {/* Sidebar Overlay*/}
      <div
        className={`fixed inset-0 bg-black z-40 ${isSideOpen ? "opacity-30" : "opacity-0 hidden pointer-events-none"
          } md:hidden`}
        onClick={() => setIsSideOpen(false)}></div>
      {/*  */}

      <div
        className={`fixed w-72 overflow-clip top-0 left-0 h-full bg-white border-r z-50 transition-all transform-gpu duration-300 ease-in-out ${isSideOpen
            ? "max-md:translate-x-0 md:w-72"
            : "max-md:-translate-x-full md:w-0"
          } md:relative`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h1 className="font-extrabold text-xl ml-1 cursor-default">
              ChatBot
            </h1>
            <EnterIcon
              onClick={() => setIsSideOpen(!isSideOpen)}
              className={`h-6 w-6 cursor-pointer text-gray-500 hover:text-black transition-colors duration-300 rotate-180`}
            />
          </div>
          
          <NewChatButton />

          <div className="my-4">
            {threads && threads.map((thread) => (
              <SideChat threadId={thread.id} key={thread.id}>{thread.title}</SideChat>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
