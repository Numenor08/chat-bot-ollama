"use client"

import React from 'react'
import { TailSpin } from 'react-loader-spinner'
import { GlobeIcon, CaretDownIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useModelContext } from '@/app/store/ContextProvider'

const ThoughtMessage = ({ thought, reasoningTime } : { thought: string, reasoningTime: number } ) => {
    const { isThinking } = useModelContext()
    const [isExpanded, setIsExpanded] = useState(true)
    if (!thought) {
        return null
    }

    return (
        <div className={`relative mb-8`}>
            <div className="flex items-center gap-2 w-min px-3 py-1.5 mb-2 bg-gray-100 rounded-lg shadow-sm hover:cursor-pointer hover:bg-gray-200"
            onClick={() => setIsExpanded(!isExpanded)}>
                <GlobeIcon className='w-3 h-3' />
                <span className="text-xs text-nowrap text-black">
                    Reasoning {reasoningTime ? `for ${reasoningTime} second` : ""}
                </span>
                <TailSpin
                    visible={isThinking}
                    color="currentColor"
                    height={12}
                    width={12}
                    ariaLabel="loading"
                    wrapperClass="inline-block"
                />
                <CaretDownIcon className={`${isExpanded ? '' : 'rotate-180'}`} />
            </div>
            {isExpanded && (
                <>
                    {/* Separator Line */}
                    <div className="absolute left-[18px] top-10 w-px h-[calc(100%-43px)] bg-gray-200" />

                    <div className='relative pl-9 mb-12'>
                        <div className='flex flex-col gap-3 text-xs/6 text-gray-400'>
                            <Markdown
                            remarkPlugins={[remarkGfm]}>
                            { thought }
                            </Markdown>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default ThoughtMessage;