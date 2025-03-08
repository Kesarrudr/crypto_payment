"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { showErrorNotification } from "@/components/error-card";

// Define the context shape
interface ErrorContextType {
  triggerError: (message: string, statusCode: number) => void;
}

// Create context
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// Provider component
export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<{
    message: string;
    statusCode: number;
  } | null>(null);

  const triggerError = (message: string, statusCode: number) => {
    setError({ message, statusCode });
  };

  useEffect(() => {
    if (error) {
      showErrorNotification(error.message, error.statusCode);
      setError(null); // Reset after showing
    }
  }, [error]);

  return (
    <ErrorContext.Provider value={{ triggerError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};
