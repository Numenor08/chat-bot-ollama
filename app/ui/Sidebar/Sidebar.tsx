"use client";

import SideChat from "@/app/ui/Sidebar/SideChat";
import { ChatBubbleIcon, EnterIcon } from "@radix-ui/react-icons";

const chatList = [
  { id: 1, name: "NodeJS" },
  { id: 2, name: "ReactJS" },
  { id: 3, name: "TypeScript" },
  { id: 4, name: "JavaScript" },
  { id: 5, name: "Python" },
];

interface SidebarProps {
  isSideOpen: boolean;
  setIsSideOpen: (value: boolean) => void;
}

function Sidebar({ isSideOpen, setIsSideOpen }: SidebarProps) {
  return (
    <>
      {/* Sidebar Overlay*/}
      <div
        className={`fixed inset-0 bg-black z-40 ${isSideOpen ? "opacity-30" : "opacity-0 hidden pointer-events-none"
          } md:hidden`}
        onClick={() => setIsSideOpen(false)}
      ></div>
      {/*  */}

      <div
        className={`fixed w-72 overflow-clip top-0 left-0 h-full bg-white border-r z-50 transition-all transform-gpu duration-300 ease-in-out ${
          isSideOpen 
            ? "max-md:translate-x-0 md:w-72" 
            : "max-md:-translate-x-full md:w-0"
        } md:relative`}
      >
        <div className="p-4">
          <div className="flex justify-between mb-2">
            <h1 className="font-extrabold text-xl ml-1 cursor-default">
              ChatBot
            </h1>
            <EnterIcon
              onClick={() => setIsSideOpen(!isSideOpen)}
              className={`h-6 w-6 cursor-pointer text-gray-500 hover:text-black transition-colors duration-300 rotate-180`}
            />
          </div>
          <div className="flex justify-center items-center rounded-3xl py-3 cursor-pointer px-4 w-min bg-blue-100 hover:bg-[rgb(204,220,242)] text-blue-600 gap-2 my-4">
            <ChatBubbleIcon className="w-5 h-full" />
            <p className="font-semibold text-sm text-nowrap">New Chat</p>
          </div>
          <div className="my-4">
            {chatList.map((chat) => (
              <SideChat key={chat.id}>{chat.name}</SideChat>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
