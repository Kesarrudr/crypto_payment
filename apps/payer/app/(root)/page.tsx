"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const MERCHANTASSOCIATEDTOKEN = "6SWXwBLjmuEHCUTwrTHDWU5XLaGQQ8hZcM3UeKUhD7Mk";

export default function Home() {
  const { publicKey } = useWallet();

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="border hover:border-slate-900 rounded">
        {/* <WalletMultiButton style={{}} /> */}
      </div>
    </main>
  );
}
