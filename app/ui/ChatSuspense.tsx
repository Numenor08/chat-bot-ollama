'use client'
import { useModelContext } from "@/app/store/ContextProvider";
import Image from 'next/image';
import { motion } from 'framer-motion';

function ChatSuspense() {
    const { isDarkMode } = useModelContext();

    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`${isDarkMode && 'dark'} flex items-center justify-center h-full w-full bg-white dark:bg-dark`}>
            {isDarkMode ? (
                <Image src="/ollama-black.png" width={100} height={100} className="max-sm:w-16" alt="Ollama White Logo" />
            ) : (

                <Image src="/ollama-white.png" width={100} height={100} className="max-sm:w-16" alt="Ollama White Logo" />
            )}
        </motion.div>
    )
}

export default ChatSuspense