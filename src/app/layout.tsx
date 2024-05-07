import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Uniswap Dashboard",
  description: "A tool to monitor and analyze the activity of developers working on Uniswap across GitHub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased ">
      <body className={inter.className}>{children}</body>
    </html>
  );
}