"use client";
import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of merchantData
interface MerchantData {
  username: string;
  publicKey: string;
  mint: string;
}

// Define the shape of the context
interface MerchantContextType {
  merchantData: MerchantData | null;
  setMerchantData: (data: MerchantData) => void;
}

// Create the context with default values
const MerchantContext = createContext<MerchantContextType | undefined>(
  undefined,
);

// Custom hook to use the UserContext
const useMerchantContext = () => {
  const context = useContext(MerchantContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};

// Provider component
const MerchantContextProvider = ({ children }: { children: ReactNode }) => {
  const [merchantData, setMerchantData] = useState<MerchantData | null>(null);

  return (
    <MerchantContext.Provider value={{ merchantData, setMerchantData }}>
      {children}
    </MerchantContext.Provider>
  );
};

export { MerchantContextProvider, useMerchantContext };
