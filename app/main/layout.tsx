import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../admin/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Guest Experience Platform",
  description: "Transform your guest experience with innovative solutions",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
