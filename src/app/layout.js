import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Engima_Message",
  description: "Anonymous messaging app.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <body className={inter.className}>
          <SessionProvider>
          {children}
          </SessionProvider>
          <Toaster />
        </body>
    </html>
  );
}
