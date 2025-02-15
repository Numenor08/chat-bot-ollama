import type { Metadata } from "next";
import { abel } from "@/app/fonts";
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
        className={`${abel.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
