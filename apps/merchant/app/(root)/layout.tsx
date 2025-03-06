"use client";

import "../globals.css";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { SessionProviderCustom } from "@/context/session";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <SessionProviderCustom>{children}</SessionProviderCustom>
        </SessionProvider>
      </body>
    </html>
  );
}
