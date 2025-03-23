import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownProps {
    children?: React.ReactNode;
    className?: string;
    ref?: React.RefObject<HTMLDivElement | null>;
    isOpen?: boolean; // Tambahkan prop untuk menentukan apakah dropdown terbuka
}

interface DropdownItem extends DropdownProps {
    onClick?: () => void;
}

export const DropdownMenu = ({ children, className, ref, isOpen }: DropdownProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10, x: '-50%' }} // Animasi saat muncul
                    animate={{ opacity: 1, y: 0, x: '-50%' }} // Animasi saat aktif
                    exit={{ opacity: 0, y: -10 }} // Animasi saat menghilang
                    transition={{ duration: 0.2 }} // Durasi animasi
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