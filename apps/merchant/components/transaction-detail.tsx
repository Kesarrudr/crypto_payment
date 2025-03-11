import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { X, ExternalLink, Copy, CheckCircle } from "lucide-react";
import { MerchantTransactionType } from "@repo/api";

interface TransactionDetailsModalProps {
  transaction: MerchantTransactionType;
  onClose: () => void;
  isOpen: boolean;
}

export default function TransactionDetailsModal({
  transaction,
  onClose,
  isOpen,
}: TransactionDetailsModalProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatTokenAmount = (amount: string, decimals: number) => {
    const value = Number.parseFloat(amount) / Math.pow(10, decimals);
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  };

  // Only render if modal is open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-lg flex flex-col max-h-[90vh]"
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700 bg-gray-800 sticky top-0 z-10">
          <h3 className="text-lg font-semibold text-white">
            Transaction Details
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {/* Status */}
          <div className="flex items-center mb-6">
            <div
              className={`h-12 w-12 rounded-full flex items-center justify-center mr-3 ${
                transaction.Status === "success"
                  ? "bg-green-500/20"
                  : "bg-red-500/20"
              }`}
            >
              {transaction.Status === "success" ? (
                <CheckCircle className={`h-6 w-6 text-green-500`} />
              ) : (
                <X className={`h-6 w-6 text-red-500`} />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-400">Status</p>
              <p
                className={`text-base font-medium ${
                  transaction.Status === "success"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {transaction.Status.charAt(0).toUpperCase() +
                  transaction.Status.slice(1)}
              </p>
            </div>
          </div>

          {/* Token Information */}
          <div className="bg-gray-700/30 rounded-lg p-4 mb-5">
            <div className="flex items-center mb-3">
              <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center mr-3 overflow-hidden">
                {transaction.token.logoURL ? (
                  <Image
                    src={transaction.token.logoURL || "/placeholder.svg"}
                    alt={transaction.token.symbol}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold">
                    {transaction.token.symbol.substring(0, 2)}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-400">Token</p>
                <p className="text-base font-medium text-white">
                  {transaction.token.name} ({transaction.token.symbol})
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Amount</p>
                <p className="text-base font-medium text-white">
                  {formatTokenAmount(
                    transaction.tokenAmount.toString(),
                    transaction.token.decimals,
                  )}{" "}
                  {transaction.token.symbol}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Value</p>
                <p className="text-base font-medium text-white">
                  ${transaction.USDTAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">
                Transaction Signature
              </p>
              <div className="flex items-center bg-gray-700/30 rounded-lg p-3">
                <p className="font-mono text-sm text-gray-300 truncate flex-1">
                  {transaction.signature}
                </p>
                <button
                  onClick={() =>
                    copyToClipboard(transaction.signature, "signature")
                  }
                  className="ml-2 p-1.5 rounded-md hover:bg-gray-600 transition-colors"
                  aria-label="Copy signature"
                >
                  {copied === "signature" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                <a
                  href={`https://explorer.solana.com/tx/${transaction.signature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 p-1.5 rounded-md hover:bg-gray-600 transition-colors"
                  aria-label="View on Solana Explorer"
                >
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1">Payer Address</p>
              <div className="flex items-center bg-gray-700/30 rounded-lg p-3">
                <p className="font-mono text-sm text-gray-300 truncate flex-1">
                  {transaction.payerAddress}
                </p>
                <button
                  onClick={() =>
                    copyToClipboard(transaction.payerAddress, "payer")
                  }
                  className="ml-2 p-1.5 rounded-md hover:bg-gray-600 transition-colors"
                  aria-label="Copy payer address"
                >
                  {copied === "payer" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                <a
                  href={`https://explorer.solana.com/address/${transaction.payerAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 p-1.5 rounded-md hover:bg-gray-600 transition-colors"
                  aria-label="View on Solana Explorer"
                >
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1">Token Address</p>
              <div className="flex items-center bg-gray-700/30 rounded-lg p-3">
                <p className="font-mono text-sm text-gray-300 truncate flex-1">
                  {transaction.token.tokenAddress}
                </p>
                <button
                  onClick={() =>
                    copyToClipboard(transaction.token.tokenAddress, "token")
                  }
                  className="ml-2 p-1.5 rounded-md hover:bg-gray-600 transition-colors"
                  aria-label="Copy token address"
                >
                  {copied === "token" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                <a
                  href={`https://explorer.solana.com/address/${transaction.token.tokenAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 p-1.5 rounded-md hover:bg-gray-600 transition-colors"
                  aria-label="View on Solana Explorer"
                >
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Date</p>
                <p className="text-base font-medium text-white">
                  {transaction.Date}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Time</p>
                <p className="text-base font-medium text-white">
                  {transaction.Time}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1">Swap Rate</p>
              <p className="text-base font-medium text-white">
                1 {transaction.token.symbol} = $
                {transaction.SwapRate.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="flex justify-end p-5 border-t border-gray-700 bg-gray-800 sticky bottom-0 z-10">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
