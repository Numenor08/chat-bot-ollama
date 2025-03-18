import { ChatBubbleIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

function NewChatButton() {
    return (
        <Link href={'/'}>
            <div
                className="flex justify-center items-center rounded-3xl py-3 cursor-pointer px-4 w-min bg-blue-100 hover:bg-[rgb(204,220,242)] text-blue-600 gap-2 my-4">
                <ChatBubbleIcon className="w-5 h-full" />
                <p className="font-semibold text-sm text-nowrap">New Chat</p>
            </div>
        </Link>
    )
}

export default NewChatButton