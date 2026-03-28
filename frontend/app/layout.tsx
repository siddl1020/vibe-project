import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "나만의 일기장",
  description: "하루를 기록하고 싶은 당신을 위한 개인 일기장",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-purple-50 font-sans text-slate-900 antialiased">
        <Header />
        <main className="flex flex-1 flex-col pb-16">{children}</main>
      </body>
    </html>
  );
}
