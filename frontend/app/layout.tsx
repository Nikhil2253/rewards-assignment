import type { Metadata } from "next";

import Header from "@/components/rootpage/Header";
import Sidebar from "@/components/rootpage/Sidebar";

import "./globals.css";

export const metadata: Metadata = {
  title: "Rewards",
  description: "Payments, transactions and rewards dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden bg-gray-50">
        <div className="flex h-screen w-full">
          <Sidebar />

          <div className="flex min-w-0 flex-1 flex-col">
            <Header />

            <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}