import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownProps {
    children?: React.ReactNode;
    className?: string;
    ref?: React.RefObject<HTMLDivElement | null>;
    isOpen?: boolean;
    isCenter?: boolean;
}

interface DropdownItem extends DropdownProps {
    onClick?: () => void;
}

export const DropdownMenu = ({ children, className, ref, isOpen, isCenter = false }: DropdownProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10, x: `${isCenter && '-50%'}` }}
                    animate={{ opacity: 1, y: 0, x: `${isCenter && '-50%'}` }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    ref={ref}
                    className={`${className} cursor-default flex flex-col items-center justify-start shadow-md rounded-lg`}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const DropdownItem = ({ className, children, onClick }: DropdownItem) => {
    return (
        <div
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick?.();
            }}
            className={`${className} flex items-center justify-start gap-2 cursor-pointer w-full rounded-lg p-2`}
        >
            {children}
        </div>
    );
};