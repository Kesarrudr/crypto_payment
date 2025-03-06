"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import QuoteComponent from "../components/quote";

export default function Home() {
  const { connected } = useWallet();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="border hover:border-slate-900 rounded p-4">
        <WalletMultiButton />
        {connected ? <QuoteComponent /> : <p>Please connect your wallet.</p>}
      </div>
    </div>
  );
}
