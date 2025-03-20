import type { Metadata } from "next";
import { inter } from "@/app/fonts";
import Sidebar from "@/app/ui/Sidebar/Sidebar";
import { ModelContextProvider } from "./store/ContextProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chat Bot",
  description: "Chat Bot UI Ollama",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased flex h-screen w-screen`}
      >
        <ModelContextProvider>
          <Sidebar />
          {children}
        </ModelContextProvider>
      </body>
    </html>
  );
}
