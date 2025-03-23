import type { Metadata, Viewport } from "next";
import { inter } from "@/app/fonts";
import Sidebar from "@/app/ui/Sidebar/Sidebar";
import { ModelContextProvider } from "@/app/store/ContextProvider";
import NextTopLoader from 'nextjs-toploader';
import "./globals.css";

export const metadata: Metadata = {
  title: "Ollama UI",
  description: "Run your own Ollama instance",
  icons: {
    icon: "/favicon.ico?v=1",
  }
};

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased flex h-screen w-screen`}>
        <ModelContextProvider>
          <Sidebar />
          <NextTopLoader
          height={2}
          showSpinner={false} 
          color="#2563eb"
          />
          {children}
        </ModelContextProvider>
      </body>
    </html>
  );
}