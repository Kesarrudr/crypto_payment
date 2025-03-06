"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface SessionContextType {
  user: {
    username?: string | null;
    authToken?: string;
    publicKey?: string;
  } | null;
  status: "loading" | "authenticated" | "unauthenticated";
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProviderCustom = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { data: session, status } = useSession();

  return (
    <SessionContext.Provider
      value={{
        user: session?.user || null,
        status,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

// Custom hook to use session context
export const useAuthSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error(
      "useAuthSession must be used within a SessionProviderCustom",
    );
  }
  return context;
};
