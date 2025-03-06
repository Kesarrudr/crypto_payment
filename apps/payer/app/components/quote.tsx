"use client";

import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import { useSwap } from "../hooks";
import TokenInput from "./TokenInput";
import MerchantInputSearch from "./MerchantSearch";

interface Token {
  tokenAddress: string;
  name: string;
  symbol: string;
  logoURL?: string;
  decimals: number;
}

export default function QuoteComponent() {
  const [usdtAmount, setUsdtAmount] = useState<number | undefined>(undefined);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [inAmount, setInAmount] = useState<string>("");
  const [quote, setQuote] = useState<string>("");

  const { getQuote, isLoading: GetQuoteLoader } = useSwap();

  const fetchQuote = useCallback(async () => {
    if (!selectedToken || !usdtAmount) return;

    const fetchedQuote = await getQuote(
      selectedToken.tokenAddress,
      String(usdtAmount),
    );
    if (fetchedQuote?.inAmount) {
      setQuote(fetchedQuote);
      setInAmount(
        String(
          Number(fetchedQuote.inAmount) / Math.pow(10, selectedToken.decimals),
        ),
      );
    } else {
      setInAmount("");
    }
  }, [selectedToken, usdtAmount, getQuote]);

  const debouncedFetchQuote = useCallback(debounce(fetchQuote, 500), [
    fetchQuote,
  ]);

  useEffect(() => {
    debouncedFetchQuote();
    return () => debouncedFetchQuote.cancel();
  }, [usdtAmount, selectedToken]);

  useEffect(() => {
    const interval = setInterval(fetchQuote, 10000);
    return () => clearInterval(interval);
  }, [fetchQuote]);

  return (
    <div className="p-4 border rounded w-96">
      <input
        id="amount"
        type="number"
        placeholder="Enter USDT amount"
        className="border p-2 w-full mb-2"
        onChange={(e) => setUsdtAmount(Number(e.target.value) || undefined)}
        value={usdtAmount || ""}
      />

      <TokenInput setSelectedToken={setSelectedToken} />

      <div className="mt-4">
        <p>
          <strong>Selected Token:</strong> {selectedToken?.symbol || "-"}
        </p>
        <p>
          <strong>Amount Needed:</strong>{" "}
          {GetQuoteLoader ? "Fetching..." : inAmount || "-"}
        </p>

        {quote && <MerchantInputSearch quote={quote} />}
      </div>
    </div>
  );
}
