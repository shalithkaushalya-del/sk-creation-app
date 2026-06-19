import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CartModal from "@/components/CartModal"; // 👈 Cart එක Import කළා

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 👈 සයිට් එකේ නම සහ විස්තරය වෙනස් කළා
export const metadata: Metadata = {
  title: "SK Creation Group",
  description: "Experience premium fashion, handcrafted arts, and digital innovation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        
        {/* 👈 Cart Modal එක මුළු සයිට් එකටම වැඩ කරන්න මෙතනින් දැම්මා */}
        <CartModal /> 
      </body>
    </html>
  );
}