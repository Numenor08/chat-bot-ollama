'use client';
import { Sun, Moon } from 'lucide-react';
import { useModelContext } from '@/app/store/ContextProvider';

function ToggleButton() {
    const { isDarkMode, handleIsDark } = useModelContext();
    const handleToggle = () => {
        handleIsDark(!isDarkMode);
    };

    return (
        <label
            htmlFor="dark-button-toggle"
            className="dark-button-toggle relative inline-flex items-center cursor-pointer w-14 h-8 rounded-full p-1 select-none
                border-2 border-gray-200 dark:border-neutral-400 dark:hover:border-light hover:border-gray-300 transition-colors group"
        >
            <input
                id="dark-button-toggle"
                name="dark-button-toggle"
                type="checkbox"
                className="sr-only"
                checked={isDarkMode}
                onChange={handleToggle}
            />
            <div
                className={`dark-button-toggle__icon flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 group-hover:bg-gray-300 dark:bg-neutral-400 dark:group-hover:bg-light transform transition-all ${
                    isDarkMode ? 'translate-x-0' : 'translate-x-[1.35rem]'
                }`}
            >
                {isDarkMode ? <Moon className="text-dark" size={16} /> : <Sun className="text-gray-800" size={16} />}
            </div>
        </label>
    );
}

export default ToggleButton;