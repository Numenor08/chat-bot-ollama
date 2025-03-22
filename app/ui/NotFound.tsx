'use client';
import Topbar from "@/app/ui/Topbar/Topbar";
import Link from "next/link";
import MainWrapper from "@/app/ui/MainWrapper";

export default function NotFoundComponent() {
    return (
        <MainWrapper>
            <div className="bg-lightImg dark:bg-darkImg flex-auto flex flex-col items-center justify-center w-full h-full">
                <Topbar />
                <div className="flex flex-col justify-center items-center h-full text-center space-y-4">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-light">Page Not Found</h1>
                    <p className="text-gray-600 dark:text-neutral-400">Sorry, the page you are looking for does not exist.</p>
                    <Link
                        href="/"
                        className="px-6 py-2 bg-blue-100 dark:bg-blue-600 text-blue-600 dark:text-white rounded-lg hover:bg-blue-200 dark:hover:bg-blue-700 transition"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        </MainWrapper>
    );
}
