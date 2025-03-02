"use client";
import { ReactNode } from "react";
import { MerchantContextProvider } from "../context";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <MerchantContextProvider>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        {children}
      </div>
    </MerchantContextProvider>
  );
};

export default Layout;
