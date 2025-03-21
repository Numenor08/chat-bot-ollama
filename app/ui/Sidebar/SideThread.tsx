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
            <Link href={`/c/${threadId}`} onClick={handleClick}>
                <div
                    className={`${isMatched ? 'bg-gray-200' : 'bg-red'} relative overflow-visible flex justify-between items-center p-[0.350rem] font-sans text-sm hover:bg-gray-100 w-full rounded-lg cursor-pointer group`}
                >
                    <input maxLength={25} onKeyDown={handleKeyDown} ref={inputRef} onBlur={handleBlur} spellCheck='false' readOnly={!isEditMode} value={inputValue} onChange={handleChange} className={`${isEditMode ? 'outline-black outline-4 bg-white cursor-text' : 'outline-none'} cursor-pointer p-[0.175rem] bg-transparent  align-middle text-nowrap`}></input>
                    <div
                        className={`${isMatched || isThreadOpen ? 'opacity-100' : ''} relative flex justify-between items-center w-5 h-5 opacity-0 group-hover:opacity-100 text-gray-500 font-bold hover:text-black dots-container`}
                    >
                        <DotsHorizontalIcon
                            onClick={(e) => {
                                e.preventDefault();
                                setIsThreadOpen(!isThreadOpen);
                            }}
                            className="w-full"
                        />
                        {isThreadOpen ? (
                            <>
                                <div
                                    className={`fixed inset-0 cursor-auto z-10 ${isThreadOpen ? "pointer-events-auto w-full h-full" : "hidden pointer-events-none"}`}
                                    onClick={() => setIsThreadOpen(false)}>
                                </div>
                                <DropdownMenu
                                    className="absolute font-normal top-6 right-0 bg-white text-black rounded-md p-1 w-28 z-20 "
                                    ref={dropdownRef}
                                >
                                    <DropdownItem onClick={handleEditMode}>
                                        <div className='w-5 h-5 flex items-center justify-center'>
                                            <Pencil2Icon />
                                        </div>
                                        Edit
                                    </DropdownItem>
                                    <DropdownItem
                                        className='text-red-600 font-semibold'
                                        onClick={() => setIsDeleteModalOpen(true)}
                                    >
                                        <div className='w-5 h-5 flex items-center justify-center'>
                                            <TrashIcon className='h-full w-full' />
                                        </div>
                                        Delete
                                    </DropdownItem>
                                </DropdownMenu>
                            </>
                        ) : null}
                    </div>
                </div>
            </Link>

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