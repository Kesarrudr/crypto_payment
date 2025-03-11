"use client";

import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import TokenInput from "./TokenInput";
import MerchantInputSearch from "./MerchantSearch";
import { TokenReturnDatatype } from "@repo/api";
import { useSwap } from "@/app/hooks";
import { Loader, RefreshCw, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function QuoteComponent() {
  const [usdAmount, setUsdAmount] = useState<string>("");
  const [usdAmountError, setUsdAmountError] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<TokenReturnDatatype>({
    symbol: "",
    name: "",
    logoURL: "",
    tags: [],
    tokenAddress: "",
    decimals: 0,
  });
  const [inAmount, setInAmount] = useState<string>("");
  const [quote, setQuote] = useState<string>("");

  const { getQuote, isLoading: quoteLoading } = useSwap();

  //TODO: if the token is USDC or USDT don't fetch the quote
  const fetchQuote = useCallback(async () => {
    if (!selectedToken || !usdAmount) return;

    const fetchedQuote = await getQuote(
      selectedToken.tokenAddress,
      String(usdAmount),
    );
    if (fetchedQuote) {
      setQuote(fetchedQuote);
      setInAmount(
        String(
          Number(fetchedQuote.inAmount) / Math.pow(10, selectedToken.decimals),
        ),
      );
    } else {
      setInAmount("");
    }
  }, [selectedToken, usdAmount, getQuote]);

  const debouncedFetchQuote = useCallback(debounce(fetchQuote, 500), [
    fetchQuote,
  ]);

  useEffect(() => {
    debouncedFetchQuote();
    return () => debouncedFetchQuote.cancel();
  }, [usdAmount, selectedToken]);

  useEffect(() => {
    const interval = setInterval(fetchQuote, 10000);
    return () => clearInterval(interval);
  }, [fetchQuote]);

  function handleUSDChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setUsdAmount(value);
    if (
      value &&
      (isNaN(Number.parseFloat(value)) || Number.parseFloat(value) <= 0)
    ) {
      setUsdAmountError("Please enter a valid amount");
    } else {
      setUsdAmountError("");
    }
  }
  return (
    <div className="space-y-6">
      {/* USDC Amount */}
      <div>
        <label
          htmlFor="usdc-amount"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Amount (USD)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-400">$</span>
          </div>
          <input
            id="usdc-amount"
            type="text"
            value={usdAmount}
            onChange={handleUSDChange}
            placeholder="0.00"
            className={`w-full pl-8 pr-4 py-3 bg-gray-700/50 border ${
              usdAmountError ? "border-red-500/50" : "border-gray-600"
            } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
          />
        </div>
        {usdAmountError && (
          <p className="mt-1 text-xs text-red-400">{usdAmountError}</p>
        )}
      </div>

      {/* Token Selection */}
      <TokenInput
        setSelectedToken={setSelectedToken}
        selectedToken={selectedToken}
      />

      {/* Quote Display */}
      {selectedToken && usdAmount && !usdAmountError && (
        <div className="bg-gray-700/30 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-300">Quote</h3>
            <div className="flex items-center">
              {quoteLoading ? (
                <Loader className="h-3 w-3 text-blue-400 animate-spin mr-1" />
              ) : (
                <RefreshCw
                  className="h-3 w-3 text-blue-400 mr-1"
                  onClick={fetchQuote}
                />
              )}
              <span className="text-xs text-gray-400">Auto-refreshing</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center mr-3 overflow-hidden">
                {selectedToken.logoURL ? (
                  <Image
                    src={selectedToken.logoURL || "/placeholder.svg"}
                    alt={selectedToken.symbol}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold">
                    {selectedToken.symbol.substring(0, 2)}
                  </span>
                )}
              </div>
              <div>
                <p className="text-lg font-medium text-white">
                  {inAmount || "0.00"}
                </p>
                <p className="text-xs text-gray-400">{selectedToken.symbol}</p>
              </div>
            </div>
            <div className="flex items-center">
              <ArrowRight className="h-5 w-5 text-gray-500 mx-4" />
              <div>
                <p className="text-lg font-medium text-white">
                  ${usdAmount || "0.00"}
                </p>
                <p className="text-xs text-gray-400">USDC</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Merchant Selection */}
      {quote && selectedToken && (
        <MerchantInputSearch
          quote={quote}
          tokenAddress={selectedToken.tokenAddress}
          tokenAmount={inAmount}
          USDCAmount={usdAmount}
          fetchingQuote={quoteLoading}
        />
      )}
    </div>
  );
}
