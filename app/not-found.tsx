'use client';
import { inter } from "@/app/fonts";
import Sidebar from "@/app/ui/Sidebar/Sidebar";
import { ModelContextProvider } from "./store/ContextProvider";
import NotFoundComponent from "@/app/ui/NotFound";
import "./globals.css";

export default function NotFound() {
  return (
    <div
      className={`${inter.className} antialiased flex h-screen w-screen`}
    >
      <ModelContextProvider>
        <Sidebar />
        <NotFoundComponent />
      </ModelContextProvider>
    </div>
  );
}
