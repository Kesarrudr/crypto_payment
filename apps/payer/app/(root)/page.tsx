"use client";

import { Wallet } from "lucide-react";
import QuoteComponent from "@/components/quote";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Home() {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Web3 Payments</h1>
          <p className="text-gray-400">
            Send payments to merchants using your preferred tokens
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 ">
          {/* Wallet Connection */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">
                  Connect Your Wallet
                </h2>
                <p className="text-sm text-gray-400">
                  Connect your wallet to start making payments
                </p>
              </div>
              <div className="wallet-adapter-button-container">
                <WalletMultiButton className="!bg-gradient-to-r !from-blue-600 !to-indigo-600 !rounded-lg !py-2.5 !px-4 !text-white !font-medium !transition-all !border-none hover:!shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
              </div>
            </div>
          </div>

          {connected ? (
            <div className="p-6">
              <QuoteComponent />
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-400 mb-6">
                Please connect your wallet to continue
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Powered by{" "}
            <span className="font-medium text-blue-500">Web3 Payments</span>
          </p>
        </div>
      </div>
    </div>
  );
}
