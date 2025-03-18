'use client';
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useParams } from 'next/navigation';

type SideChatProps = {
    threadId: string,
    children: string
}

function SideChat({ threadId, children }: SideChatProps) {
    const params = useParams()
    const isMatched: boolean = params.threadId === threadId
    return (
        <Link href={`/c/${threadId}`}>
            <div className={`${isMatched ? 'bg-gray-200' : 'bg-red'} flex justify-between items-center py-2 px-2 font-sans text-sm hover:bg-gray-100 w-full rounded-lg cursor-pointer group`}>
                <p className='align-middle'>{children}</p>
                <div className='flex justify-between items-center w-5 h-5 opacity-0 group-hover:opacity-100 text-gray-500 font-bold hover:text-black'>
                    <DotsHorizontalIcon className='w-full' />
                </div>
            </div>
        </Link>
    )
}

export default SideChat