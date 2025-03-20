"use client";

import SideThread from "@/app/ui/Sidebar/SideThread";
import { EnterIcon } from "@radix-ui/react-icons";
import { db, Thread } from "@/app/lib/dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { useModelContext } from "@/app/store/ContextProvider";
import NewChatButton from "@/app/ui/Sidebar/NewChatButton";

function Sidebar() {
  const { isSideOpen, setIsSideOpen } = useModelContext();
  const threads: Record<string, Thread[]> = useLiveQuery(() => db.getAllThreads(), []) || {}

  return (
    <>
      {/* Sidebar Overlay*/}
      <div
        className={`fixed inset-0 bg-black z-40 ${isSideOpen ? "opacity-30" : "opacity-0 hidden pointer-events-none"
          } lg:hidden`}
        onClick={() => setIsSideOpen(false)}></div>
      {/*  */}

      <div
        className={`fixed max-lg:w-72 overflow-clip top-0 left-0 h-full bg-zinc-50 border-r z-50 transition-all transform-gpu duration-300 ease-in-out ${isSideOpen
          ? "max-lg:translate-x-0 lg:w-80"
          : "max-lg:-translate-x-full lg:w-0"
          } lg:relative`}
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

          <div className="my-4 flex flex-col space-y-4">
            {threads && Object.entries(threads).map(([group, groupThreads]) => (
              <div key={group}>
                {groupThreads.length !== 0 && (
                  <h3 className="text-black text-left text-xs font-sans font-semibold mb-2 ml-2">{group}</h3>)
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
