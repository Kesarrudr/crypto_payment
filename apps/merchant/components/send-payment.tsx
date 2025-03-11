"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Send,
  AlertCircle,
  CheckCircle,
  Loader,
  ArrowRight,
} from "lucide-react";

interface SendPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (txSignature: string) => void;
}

// Mock function to simulate payment processing
const processSendPayment = async (
  recipientAddress: string,
  amount: number,
): Promise<{
  success: boolean;
  status: "success" | "failed" | "pending";
  signature?: string;
  message: string;
}> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Randomly determine success/failure for demo purposes
  const random = Math.random();

  if (random > 0.8) {
    return {
      success: false,
      status: "failed",
      message: "Insufficient funds to complete this transaction.",
    };
  } else if (random > 0.6) {
    return {
      success: true,
      status: "pending",
      signature: `Sig_${Math.random().toString(36).substring(2, 14)}`,
      message: "Transaction submitted and pending confirmation.",
    };
  } else {
    return {
      success: true,
      status: "success",
      signature: `Sig_${Math.random().toString(36).substring(2, 14)}`,
      message: "Payment sent successfully!",
    };
  }
};

export default function SendPaymentModal({
  isOpen,
  onClose,
  onSuccess,
}: SendPaymentModalProps) {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    status: "success" | "failed" | "pending" | null;
    message: string;
    signature?: string;
  } | null>(null);
  const [errors, setErrors] = useState<{
    recipientAddress?: string;
    amount?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      recipientAddress?: string;
      amount?: string;
    } = {};

    if (!recipientAddress.trim()) {
      newErrors.recipientAddress = "Recipient address is required";
    } else if (recipientAddress.length < 32) {
      newErrors.recipientAddress = "Please enter a valid Solana address";
    }

    if (!amount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsProcessing(true);
    setResult(null);

    try {
      const response = await processSendPayment(
        recipientAddress,
        Number(amount),
      );

      setResult({
        status: response.status,
        message: response.message,
        signature: response.signature,
      });

      if (response.success && response.signature && onSuccess) {
        onSuccess(response.signature);
      }
    } catch (error) {
      setResult({
        status: "failed",
        message: "An error occurred while processing your payment.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setRecipientAddress("");
    setAmount("");
    setResult(null);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md overflow-hidden shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Send className="h-5 w-5 mr-2 text-blue-400" />
            Send Payment
          </h3>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="recipient-address"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Recipient Address
                </label>
                <input
                  id="recipient-address"
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="Enter Solana address"
                  className={`w-full px-4 py-2.5 bg-gray-700/50 border ${
                    errors.recipientAddress
                      ? "border-red-500/50"
                      : "border-gray-600"
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
                />
                {errors.recipientAddress && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.recipientAddress}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Amount (USD)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-400">$</span>
                  </div>
                  <input
                    id="amount"
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className={`w-full pl-8 pr-4 py-2.5 bg-gray-700/50 border ${
                      errors.amount ? "border-red-500/50" : "border-gray-600"
                    } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-xs text-red-400">{errors.amount}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-70 flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Send Payment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="py-4">
              <div className="flex justify-center mb-6">
                <div
                  className={`h-16 w-16 rounded-full flex items-center justify-center ${
                    result.status === "success"
                      ? "bg-green-500/20"
                      : result.status === "pending"
                        ? "bg-yellow-500/20"
                        : "bg-red-500/20"
                  }`}
                >
                  {result.status === "success" ? (
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  ) : result.status === "pending" ? (
                    <Loader className="h-8 w-8 text-yellow-500 animate-spin" />
                  ) : (
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  )}
                </div>
              </div>

              <h4
                className={`text-lg font-medium text-center mb-2 ${
                  result.status === "success"
                    ? "text-green-400"
                    : result.status === "pending"
                      ? "text-yellow-400"
                      : "text-red-400"
                }`}
              >
                {result.status === "success"
                  ? "Payment Successful"
                  : result.status === "pending"
                    ? "Payment Pending"
                    : "Payment Failed"}
              </h4>

              <p className="text-gray-300 text-center mb-4">{result.message}</p>

              {result.signature && (
                <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-400 mb-1">
                    Transaction Signature:
                  </p>
                  <p className="font-mono text-sm text-gray-300 truncate">
                    {result.signature}
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={resetForm}
                  className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-200 transition-colors"
                >
                  New Payment
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
