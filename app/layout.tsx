import type { Metadata } from "next";
import {Manrope} from "next/font/google";
import "./globals.css";
import {ReactNode} from "react";
import Menu from "@/components/menu";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TatraShare",
  description: "An app for HK2026 TB challenge.",
};

export default function Layout({children}: Readonly<{children: ReactNode}>) {
  return (
    <html lang="en" className={`${manrope.variable} font-manrope h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-black text-white font-medium text-[16px] tracking-[-0.02em]">
        {children}
        <Menu/>
      </body>
    </html>
  );
}
