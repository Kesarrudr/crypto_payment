"use client";

import { motion } from "framer-motion";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export default function LoadingOverlay({
  isVisible,
  message = "Processing...",
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="rounded-xl bg-gray-800 p-6 shadow-2xl border border-gray-700 max-w-sm mx-4"
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            {/* Outer ring */}
            <div className="h-16 w-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>

            {/* Inner pulse */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-blue-500/20 animate-pulse"></div>
            </div>
          </div>

          <h3 className="text-lg font-medium text-white mb-1">{message}</h3>
          <p className="text-sm text-gray-400">
            Please wait while we process your request
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
