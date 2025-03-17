import React from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'

function SideChat({children}: {children: string}) {
    return (
        <div className='flex justify-between items-center py-2 px-2 font-sans text-sm hover:bg-gray-200 w-full rounded-lg cursor-pointer group'>
            <p className='align-middle'>{children}</p>
            <div className='flex justify-between items-center w-5 h-5 opacity-0 group-hover:opacity-100 text-gray-500 font-bold hover:text-black'>
                <DotsHorizontalIcon className='w-full' />
            </div>
        </div>
    )
}

export default SideChat