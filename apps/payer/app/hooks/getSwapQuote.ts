import axios, { AxiosRequestConfig } from "axios";
import { useState } from "react";

const useSwap = () => {
  //TODO: currenty not showing the associated token account
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getQuote = async (tokenAddress: string, amount: string) => {
    if (!tokenAddress || !amount) return;

    try {
      setIsLoading(true);
      const swapAmount = Number(amount) * Math.pow(10, 6); // ONLY ACCEPTING USDC

      const params = new URLSearchParams({
        inputMint: tokenAddress,
        outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC TOKEN ADDRESS
        amount: String(swapAmount),
        slippageBps: "50",
        restrictIntermediateTokens: "true", // Added this param
        swapMode: "ExactOut", // Added this param
      }).toString();

      const config: AxiosRequestConfig = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://api.jup.ag/swap/v1/quote?${params}`,
        headers: {
          "Content-Type": "application/json",
        },
      };

      const respone = await axios.request(config);

      if (respone.status === 200) {
        return respone.data;
      }
    } catch (error) {
      console.error("Error fetching merchant details", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, getQuote };
};

export { useSwap };
