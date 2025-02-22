"use client"

import React from 'react'
import { TailSpin } from 'react-loader-spinner'
import { inter } from '@/app/fonts'
import { GlobeIcon, CaretDownIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

const ThoughtMessage = ({ thought } : { thought: string } ) => {
    const [isExpanded, setIsExpanded] = useState(true)

    if (!thought) {
        return null
    }

    return (
        <div className={`${inter.className} relative mb-8`}>
            <div className="flex items-center gap-2 w-min px-3 py-1.5 mb-2 bg-gray-100 rounded-lg shadow-sm hover:cursor-pointer hover:bg-gray-200"
            onClick={() => setIsExpanded(!isExpanded)}>
                <GlobeIcon className='w-3 h-3' />
                <span className="text-xs text-black">Thinking</span>
                <TailSpin
                    color="currentColor"
                    height={12}
                    width={12}
                    ariaLabel="loading"
                    wrapperClass="inline-block mr-2"
                />
                <CaretDownIcon className={`${isExpanded ? '' : 'rotate-180'} ml-2`} />
            </div>
            {isExpanded && (
                <>
                    {/* Separator Line */}
                    <div className="absolute left-[18px] top-10 w-px h-[calc(100%-43px)] bg-gray-200" />

                    <div className='relative pl-9'>
                        <div className='flex flex-col gap-3 text-xs/6 text-gray-400'>
                            <ReactMarkdown>
                            { thought }
                            </ReactMarkdown>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default ThoughtMessage;