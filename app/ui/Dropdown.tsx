import React from 'react';


interface DropdownProps {
    children?: React.ReactNode;
    className?: string;
    ref?: React.RefObject<HTMLDivElement | null>;
}

interface DropdownItem extends DropdownProps {
    onClick?: () => void;
}

export const DropdownMenu = ({ children, className, ref }: DropdownProps) => {
    return (
        <div 
        onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
        }}
        ref={ref} className={`${className} cursor-default flex flex-col items-center justify-start shadow-md rounded-lg`}>
            {children}
        </div>
    );
}

export const DropdownItem = ({ className, children, onClick }: DropdownItem) => {
    return (
        <div onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            onClick?.();
        }} className={`${className} flex items-center justify-start gap-2 cursor-pointer w-full rounded-lg p-2`}>
            {children}
        </div>
    )
}