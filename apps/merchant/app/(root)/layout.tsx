"use client";

import "../globals.css";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { SessionProviderCustom } from "@/context/session";
import { ErrorToastContainer } from "@/components/error-card";
import { setGlobalErrorHandler } from "@/axios-config/axios";
import { ErrorProvider, useError } from "@/context/ErrorProvider";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

function GlobalErrorHandler() {
  const { triggerError } = useError(); // ✅ Now it's inside <ErrorProvider>

  useEffect(() => {
    setGlobalErrorHandler(triggerError);
  }, [triggerError]);

  return null; // This component doesn't render anything
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <SessionProviderCustom>
            <ErrorProvider>
              <GlobalErrorHandler />
              {children} <ErrorToastContainer />
            </ErrorProvider>
          </SessionProviderCustom>
        </SessionProvider>
      </body>
    </html>
  );
}
