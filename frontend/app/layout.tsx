import type { Metadata } from "next";

import Header from "@/components/rootpage/Header";
import Sidebar from "@/components/rootpage/Sidebar";

import "./globals.css";

export const metadata: Metadata = {
  title: "PayRewards",
  description: "Payments, transactions and rewards dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Header />

        <div className="flex">
          <Sidebar />

          {children}
        </div>
      </body>
    </html>
  );
}