import type { Metadata } from "next";
import { inter } from "@/app/fonts";
import SidebarWrapper from "@/app/ui/Sidebar/SidebarWrapper";
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
        <SidebarWrapper />
        {children}
      </body>
    </html>
  );
}
