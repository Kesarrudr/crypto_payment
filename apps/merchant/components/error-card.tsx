"use client";

import type React from "react";
import { toast, type ToastOptions, ToastContainer } from "react-toastify";
import { AlertCircle, X } from "lucide-react";

interface ErrorCardProps {
  title?: string;
  message: string;
  statusCode?: number;
}

const ErrorCard: React.FC<ErrorCardProps> = ({
  title = "Error",
  message,
  statusCode,
}) => {
  return (
    <div className="flex flex-col w-full max-w-[340px] bg-gray-800 rounded-lg border border-red-500/30 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-red-500/10 px-4 py-2 border-b border-red-500/20">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <h3 className="font-medium text-red-400">{title}</h3>
        </div>
        {statusCode && (
          <span className="text-xs px-2 py-1 bg-red-500/20 rounded-full text-red-400">
            {statusCode}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-sm text-gray-300 mb-3">{message}</p>

        {/* Action buttons */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast.dismiss();
            }}
            className="flex items-center text-xs px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 transition-colors"
          >
            <X className="h-3 w-3 mr-1" />
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

function showErrorNotification(message: string, statusCode: number) {
  let title = `Error`;

  const toastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    closeButton: false,
  };

  return toast.error(
    <ErrorCard title={title} message={message} statusCode={statusCode} />,
    toastOptions,
  );
}

// Export a configured ToastContainer for easy import
function ErrorToastContainer() {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  );
}

export { ErrorToastContainer, showErrorNotification };
