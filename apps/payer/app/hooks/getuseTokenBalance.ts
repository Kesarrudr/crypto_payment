import {
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useState } from "react";

const useTokenBalnace = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { connection } = useConnection();

  const getTokenBalance = async (
    publicKey: PublicKey,
    mint: string,
    TOKEN_PROGRAM: PublicKey,
  ) => {
    try {
      setIsLoading(true);

      console.log("mint address", mint);
      console.log("public key", publicKey.toBase58());
      const mintPublickey = new PublicKey(mint);
      const tokenaccount = await getAssociatedTokenAddress(
        mintPublickey,
        publicKey,
        false,
        TOKEN_PROGRAM,
      );
      console.log("token account", tokenaccount.toBase58());
      return await connection.getTokenAccountBalance(tokenaccount);
    } catch (error) {
      //TODO: do error managment
      console.log("Error while getting the balance", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, getTokenBalance };
};

export { useTokenBalnace };
