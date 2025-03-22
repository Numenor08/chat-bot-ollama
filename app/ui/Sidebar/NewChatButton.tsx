'use client'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useModelContext } from "@/app/store/ContextProvider";

function NewChatButton() {
    const { isSideOpen } = useModelContext();
    return (
        <Link href={'/'} className="flex justify-center items-center rounded-3xl py-2 cursor-pointer px-4 w-full bg-blue-100 hover:bg-[rgb(204,220,242)] dark:bg-blue-600 dark:hover:bg-[rgb(37,88,199)] text-blue-600 dark:text-white gap-2">
            <ChatBubbleIcon className={`${!isSideOpen && 'opacity-0'} transition-opacity duration-75 w-5 h-full`} />
            <p className={`${!isSideOpen && 'opacity-0'} transition-opacity duration-75 font-semibold text-sm text-nowrap`}>New Chat</p>
        </Link>
    )
}

export default NewChatButton