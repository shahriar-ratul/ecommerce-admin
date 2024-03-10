import "@/styles/globals.css";
import React from "react";
import { Inter } from "next/font/google";

import { type Metadata } from "next";
import Providers from "./provider";

import { Toaster as SonnerToaster } from "@/components/ui/sonner";

// Inter font
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // console.log("session", session);

  return (
    <>
      <html
        lang="en"
        suppressHydrationWarning={true}
        suppressContentEditableWarning={true}
      >
        <body className={inter.className} suppressHydrationWarning={true}>
          <Providers>{children}</Providers>
          <SonnerToaster />
        </body>
      </html>
    </>
  );
}
