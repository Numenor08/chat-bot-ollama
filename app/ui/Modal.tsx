'use client';

import { createPortal } from 'react-dom';

type ConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    value?: string;
};

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    value,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
                <hr className="border-gray-200 w-full my-4" />
                <p className='w-min text-sm text-nowrap font-semibold px-1 rounded-lg my-2 bg-gray-100'>{value}</p>
                <p className="text-sm text-gray-600 mb-6">{message}</p>
                <div className="flex font-mono text-sm tracking-tight justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-1 bg-transparent text-gray-700 rounded-3xl border-2 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-1 bg-red-600 text-white rounded-3xl hover:bg-red-700"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>,
        document.body // Render modal langsung ke dalam <body>
    );
}