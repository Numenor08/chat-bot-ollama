import { ChatBubbleIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

function NewChatButton() {
    return (
        <Link href={'/'} className="flex justify-center items-center rounded-3xl py-2 cursor-pointer px-4 w-full bg-blue-100 hover:bg-[rgb(204,220,242)] text-blue-600 gap-2">
            <ChatBubbleIcon className="w-5 h-full" />
            <p className="font-semibold text-sm text-nowrap">New Chat</p>
        </Link>
    )
}

export default NewChatButton