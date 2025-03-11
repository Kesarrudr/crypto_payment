import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { VersionedTransaction } from "@solana/web3.js";
import axios from "axios";
import { useState } from "react";

const useSendSwapTransaction = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { signTransaction, publicKey } = useWallet();
  const { connection } = useConnection();

  const sendSwapTransaction = async (
    quote: string,
    merchatUSDCTokenAccount: string,
  ) => {
    if (!signTransaction || !publicKey) {
      console.error("Wallet not connected or signTransaction not available.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post(
        "https://api.jup.ag/swap/v1/swap",
        {
          quoteResponse: quote,
          userPublicKey: publicKey.toBase58(),
          destinationTokenAccount: merchatUSDCTokenAccount,
          wrapAndUnwrapSol: true,
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      const transactionData = response.data.swapTransaction;

      const transactionBuffer = Buffer.from(transactionData, "base64");
      const transaction = VersionedTransaction.deserialize(transactionBuffer);

      await signTransaction(transaction);

      const latestBlockHash = await connection.getLatestBlockhash();
      const rawTransaction = transaction.serialize();

      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });

      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txid,
      });

      return txid;
    } catch (error) {
      console.error("Error during swap transaction:", error);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendSwapTransaction, isLoading };
};

export { useSendSwapTransaction };
