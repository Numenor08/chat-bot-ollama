'use client';

import { createPortal } from 'react-dom';
import { useModelContext } from '@/app/store/ContextProvider';

type ConfirmationModalProps = {
    className?: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    value?: string;
};

export default function ConfirmationModal({
    className,
    isOpen,
    onClose,
    onConfirm,
    value,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    const { isDarkMode } = useModelContext();

    return createPortal(
        <div className={`${isDarkMode && 'dark'} fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 dark:bg-opacity-50`}>
            <div className="bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-white">{title}</h2>
                <hr className="border-gray-200 dark:border-neutral-700 w-full my-4" />
                <p className='w-min text-sm text-nowrap font-semibold px-1 rounded-lg my-2 text-black dark:text-light bg-gray-100 dark:bg-darkChat'>{value}</p>
                <p className="text-sm text-gray-600 dark:text-white mb-6">{message}</p>
                <div className="flex font-mono text-sm tracking-tight justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-1 bg-transparent dark:bg-white text-gray-700 dark:text-black rounded-3xl border-2 hover:bg-gray-100 dark:hover:bg-neutral-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-1 rounded-3xl border bg-red-100 text-red-600 font-bold dark:border-none dark:bg-red-600 dark:text-white dark:hover:bg-red-700"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>,
        document.body // Render modal langsung ke dalam <body>
    );
}