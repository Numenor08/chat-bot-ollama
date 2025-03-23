"use client";

import SideThread from "@/app/ui/Sidebar/SideThread";
import { EnterIcon } from "@radix-ui/react-icons";
import { db, Thread } from "@/app/lib/dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { useModelContext } from "@/app/store/ContextProvider";
import NewChatButton from "@/app/ui/Sidebar/NewChatButton";
import Image from "next/image";
import Link from "next/link";

function Sidebar() {
  const { isSideOpen, setIsSideOpen, isDarkMode } = useModelContext();
  const threads: Record<string, Thread[]> = useLiveQuery(() => db.getAllThreads(), []) || {}

  return (
    <>
      {/* Sidebar Overlay*/}
      <div
        className={`${isDarkMode && 'dark'} fixed inset-0 bg-black z-40 ${isSideOpen ? "opacity-30 dark:opacity-20" : "opacity-0 hidden pointer-events-none"
          } lg:hidden`}
        onClick={() => setIsSideOpen(false)}></div>
      {/*  */}

      <div
        className={`${isDarkMode && 'dark'} fixed max-lg:w-72 max-[450px]:w-56 overflow-x-clip top-0 left-0 h-full max-h-screen bg-zinc-50 border-r dark:border-r-0 dark:bg-neutral-900 dark:text-light dark:font-light z-50 transition-[width,transform,translate] duration-300 ease-in-out ${isSideOpen
          ? "max-lg:translate-x-0 lg:w-80"
          : "max-lg:-translate-x-full lg:w-0"
          } lg:relative`}
      >
        <div className="relative py-4 pl-4 flex flex-col h-full overflow-y-auto gap-8">
          <div className="flex justify-between items-center mr-4">
        <Link href={'/'}>
          <div className="flex items-center">
            {isDarkMode ? (
          <Image src="/ollama-black.png" width={40} height={40} alt="Ollama Black Logo" />
            ) : (
          <Image src="/ollama-white.png" width={40} height={40} alt="Ollama White Logo" />
            )}
            <h1 className="font-extrabold text-nowrap text-xl ml-1">
          Ollama UI
            </h1>
          </div>
        </Link>

        <EnterIcon
          onClick={() => setIsSideOpen(!isSideOpen)}
          className={`sidebar-button rotate-180`}
        />
          </div>

          <div className="flex justify-between items-center mr-4">
        <NewChatButton />
          </div>

          <div className="flex-1 flex flex-col overflow-y-auto sidebar-custom pr-2">
        {threads && Object.entries(threads).map(([group, groupThreads]) => (
          <div key={group} className="mb-6">
            {groupThreads.length !== 0 && (
          <h3 className="text-nowrap dark:font-bold text-left text-xs font-sans pb-2 font-semibold pl-2 sticky bg-zinc-50 w-full dark:bg-neutral-900 top-0 bg- z-10">{group}</h3>)
            }

            {groupThreads.map((thread: any) => (
          <SideThread
            isSideOpen={isSideOpen}
            threadId={thread.id}
            key={thread.id}
            value={thread.title}
          >
          </SideThread>
            ))}
          </div>
        ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
