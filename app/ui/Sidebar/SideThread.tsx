'use client';
import { useState, useRef, useEffect } from 'react';
import { DotsHorizontalIcon, Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { DropdownItem, DropdownMenu } from '@/app/ui/Dropdown';
import { db } from '@/app/lib/dexie';
import ConfirmationModal from '@/app/ui/Modal';

type SideThreadProps = {
    isSideOpen: boolean;
    threadId: string;
    value: string;
    children?: React.ReactNode;
};

function SideThread({ isSideOpen, threadId, value }: SideThreadProps) {
    const [isThreadOpen, setIsThreadOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>(value);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const params = useParams();
    const isMatched: boolean = params.threadId === threadId;
    const route = useRouter();

    const handleRename = (input: string) => {
        try {
            if (input !== value) {
                const renameThread = async () => {
                    await db.updateThread(threadId, input);
                };
                renameThread();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {
        try {
            await db.deleteThread(threadId);
            if (params.threadId === threadId){
                route.replace('/');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) {
            e.preventDefault();
            return;
        }

        if ((e.target as HTMLElement).closest(".dots-container")) {
            e.preventDefault();
            return;
        }
    };

    const handleEditMode = () => {
        setIsEditMode(true);
        inputRef.current?.focus();
        setIsThreadOpen(false);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }

    const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setIsEditMode(false);
        if (!input.trim()) {
            setInputValue(value);
            return;
        }
        handleRename(input.trim());
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
            e.preventDefault();
            inputRef.current?.blur();
        }
    };
    
    useEffect(() => {
        if (!isSideOpen) {
            setIsThreadOpen(false);
        }

    },[isSideOpen]);

    return (
        <>
            <div className="relative group">
                {/* Link untuk navigasi */}
                <Link
                    href={`/c/${threadId}`}
                    className={` flex justify-between items-center p-[0.350rem] font-sans text-sm group-hover:bg-gray-100 dark:group-hover:bg-neutral-800 w-full rounded-lg cursor-pointer ${
                        isMatched ? 'bg-gray-200 dark:bg-neutral-700' : ''
                    }`}
                >
                    <input
                        maxLength={28}
                        onKeyDown={handleKeyDown}
                        ref={inputRef}
                        onBlur={handleBlur}
                        spellCheck="false"
                        readOnly={!isEditMode}
                        value={inputValue}
                        onChange={handleChange}
                        className={`${
                            isEditMode ? 'bg-transparent cursor-text' : 'outline-none'
                        } cursor-pointer p-[0.175rem] bg-transparent w-[80%] align-middle text-nowrap`}
                    />
                    {isThreadOpen && (
                        <div
                        className={`fixed inset-0 cursor-auto z-20`}
                        onClick={(e) => {
                            e.preventDefault();
                            setIsThreadOpen(false);
                        }}
                    ></div>
                    )}
                </Link>

                {/* DotsHorizontalIcon dan DropdownMenu */}
                <div
                    className={`opacity-0 ${isMatched || isThreadOpen ? 'opacity-100' : ''} z-20 text-sm group-hover:opacity-100 absolute top-1/2 transform -translate-y-1/2 right-2 flex items-center justify-center w-5 h-5 font-bold text-gray-500 dark:text-neutral-400 hover:text-black dark:hover:text-white dots-container`}
                >
                    <DotsHorizontalIcon
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsThreadOpen(!isThreadOpen);
                        }}
                        className="w-full cursor-pointer"
                    />
                    {isThreadOpen && (
                        <>
                            <DropdownMenu
                                className="absolute border dark:border-neutral-600 font-normal top-6 right-0 bg-white text-black dark:bg-darkChat dark:text-light rounded-md p-1 w-28 z-20"
                                ref={dropdownRef}
                            >
                                <DropdownItem
                                    onClick={handleEditMode}
                                    className="hover:bg-gray-200 dark:hover:bg-neutral-700"
                                >
                                    <div className="w-5 h-5 flex items-center justify-center">
                                        <Pencil2Icon />
                                    </div>
                                    Edit
                                </DropdownItem>
                                <DropdownItem
                                    className="text-red-600 font-semibold hover:bg-gray-200 dark:hover:bg-neutral-700"
                                    onClick={() => setIsDeleteModalOpen(true)}
                                >
                                    <div className="w-5 h-5 flex items-center justify-center">
                                        <TrashIcon className="h-full w-full" />
                                    </div>
                                    Delete
                                </DropdownItem>
                            </DropdownMenu>
                        </>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => {
                    handleDelete();
                    setIsDeleteModalOpen(false);
                }}
                value={value}
                title="Delete Thread"
                message="Are you sure you want to delete this thread?"
            />
        </>
    );
}

export default SideThread;