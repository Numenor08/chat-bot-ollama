"use client";

import { useModelContext } from "@/app/store/ContextProvider";

export default function MainWrapper({ children }: {children: React.ReactNode}) {
  const { isDarkMode } = useModelContext();

  return (
    <main className={`${isDarkMode && 'dark'} bg-lightImg dark:bg-darkImg relative flex flex-col items-center justify-center w-full h-full max-h-screen`}>
        {children}
    </main>
  );
}