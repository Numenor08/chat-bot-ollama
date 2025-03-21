'use client';
import { inter } from "@/app/fonts";
import Sidebar from "@/app/ui/Sidebar/Sidebar";
import Topbar from "@/app/ui/Sidebar/Topbar";
import { ModelContextProvider } from "./store/ContextProvider";
import "./globals.css";
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className={`${inter.className} antialiased flex h-screen w-screen`}
    >
      <ModelContextProvider>
        <Sidebar />
        <div className="flex-auto flex flex-col items-center justify-between w-full h-full">
          <Topbar />
            <div className="flex flex-col justify-center items-center h-full text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-800">Page Not Found</h1>
            <p className="text-gray-600">Sorry, the page you are looking for does not exist.</p>
            <Link
              href="/"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Return Home
            </Link>
            </div>
        </div>
      </ModelContextProvider>
    </div>
  );
}
