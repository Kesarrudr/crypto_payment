"use client";
import { useAuthSession } from "@/context/session";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { status } = useAuthSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]); // Ensure this runs when status changes

  return <div>{children}</div>;
};

export default Layout;
