import { UserProvider } from "@/components/UserContext";
import AuthGuard from "@/components/AuthGuard";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "阿寶的理想生活",
  description: "阿寶的理想生活",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <html
      lang="zh-TW"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >

      <body className="min-h-full flex flex-col">

        <UserProvider>

          <AuthGuard>

            {children}

          </AuthGuard>

        </UserProvider>

      </body>

    </html>

  );

}