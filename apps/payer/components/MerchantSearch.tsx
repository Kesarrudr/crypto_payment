"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import debounce from "lodash.debounce";
import { useWallet } from "@solana/wallet-adapter-react";
import { MerchantReturnDataType, TransactionType } from "@repo/api";
import { useMerchantSearchQuery, useSendSwapTransaction } from "@/app/hooks";
import { saveTx } from "@/app/hooks/saveTx";
import { getISTDate, getISTTime } from "@/helper/functions";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp, ChevronDown, Search, AlertCircle } from "lucide-react";

interface Props {
  quote: string;
  tokenAmount: string;
  USDCAmount: string;
  fetchingQuote: boolean;
  tokenAddress: string;
}

export default function MerchantInputSearch({
  quote,
  tokenAmount,
  USDCAmount,
  tokenAddress,
  fetchingQuote,
}: Props) {
  const { connected, publicKey } = useWallet();
  if (!connected || !publicKey) {
    return;
  }
  const [searchUsername, setSearchUsername] = useState<string>("");
  const [selectedMerchant, setSelectedMerchant] =
    useState<MerchantReturnDataType>({
      username: "",
      publicKey: "",
      AssociatedTokenAccount: {
        accountAddress: "",
      },
    });
  const [merchants, setMerchants] = useState<MerchantReturnDataType[]>([]);
  const { isLoading: merchantSearchLoading, merchantSearch } =
    useMerchantSearchQuery();

  const { isLoading: sendTxLoading, sendSwapTransaction } =
    useSendSwapTransaction();

  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  //TODO: for showing status of tx
  const [transactionSignature, setTransactionSignature] = useState<string>("");
  const [transactionError, setTransactionError] = useState<string>("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setMerchants([]);
        return;
      }
      const results = await merchantSearch(query);
      if (results) setMerchants(results);
    }, 500),
    [], //WARNING: not in working
  );

  useEffect(() => {
    if (searchUsername.trim()) {
      debouncedSearch(searchUsername);
    } else {
      setMerchants([]);
    }
    return () => debouncedSearch.cancel();
  }, [searchUsername, debouncedSearch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectMerchant = (merchant: MerchantReturnDataType) => {
    setSelectedMerchant(merchant);
    setSearchUsername("");
    setShowDropdown(false);
  };

  async function handlePayment() {
    if (
      !connected ||
      !publicKey ||
      !selectedMerchant ||
      !selectedMerchant.AssociatedTokenAccount?.accountAddress
    ) {
      return;
    }
    try {
      const signature = await sendSwapTransaction(
        quote,
        selectedMerchant.AssociatedTokenAccount.accountAddress,
      );

      if (signature) {
        setTransactionSignature(signature);

        const txData: TransactionType = {
          merchantUserName: selectedMerchant.username,
          payerAddress: publicKey.toBase58(),
          signature,
          tokenAddress,
          tokenAmount,
          USDCAmount,
          Status: "success",
          date: getISTDate(),
          time: getISTTime(),
        };

        saveTx(txData);
        console.log("Saving transaction:", txData);
      } else {
        setTransactionError("Transaction failed. Please try again.");
      }
    } catch (error) {
      setTransactionError("An error occurred while processing your payment.");
      console.error("Payment error:", error);
    }
  }

  return (
    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Pay To
      </label>
      <div className="relative" ref={dropdownRef}>
        <div
          className="flex items-center justify-between p-3 bg-gray-700/50 border border-gray-600 rounded-lg cursor-pointer text-white"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {selectedMerchant ? (
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                <span className="text-blue-400 font-medium">
                  {selectedMerchant.username.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium">{selectedMerchant.username}</p>
                <p className="text-xs text-gray-400 truncate max-w-[200px]">
                  {selectedMerchant.publicKey}
                </p>
              </div>
            </div>
          ) : (
            <span className="text-gray-400">Select a merchant</span>
          )}
          {showDropdown ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>

        {/* Merchant Dropdown */}
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-2">
                <div className="relative mb-2">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    placeholder="Search merchants..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div className="max-h-60 overflow-y-auto">
                  {merchantSearchLoading ? (
                    <div className="flex justify-center items-center py-4">
                      <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : merchants.length > 0 ? (
                    <div className="space-y-1">
                      {merchants.map((merchant) => (
                        <div
                          key={merchant.publicKey}
                          className={`flex items-center p-2 hover:bg-gray-700 rounded-md cursor-pointer transition-colors ${
                            !merchant.AssociatedTokenAccount ? "opacity-50" : ""
                          }`}
                          onClick={() =>
                            merchant.AssociatedTokenAccount &&
                            handleSelectMerchant(merchant)
                          }
                        >
                          <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                            <span className="text-blue-400 font-medium">
                              {merchant.username.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              <p className="font-medium text-white">
                                {merchant.username}
                              </p>
                              {!merchant.AssociatedTokenAccount && (
                                <span className="ml-2 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                                  Not Available
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 truncate">
                              {merchant.publicKey}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchUsername ? (
                    <p className="text-center py-4 text-gray-400">
                      No merchants found
                    </p>
                  ) : (
                    <p className="text-center py-4 text-gray-400">
                      Type to search merchants
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selectedMerchant && !selectedMerchant.AssociatedTokenAccount && (
        <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-xs text-red-400">
              This merchant doesn't have an associated token account. You cannot
              send payments to them at this time.
            </p>
          </div>
        </div>
      )}

      {selectedMerchant && selectedMerchant.AssociatedTokenAccount && (
        <button
          disabled={sendTxLoading || fetchingQuote}
          className={`mt-4 w-full py-3 px-4 rounded-lg font-medium transition-all ${
            sendTxLoading || fetchingQuote
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          }`}
          onClick={handlePayment}
        >
          {sendTxLoading
            ? "Processing..."
            : fetchingQuote
              ? "Updating Quote..."
              : "Pay Now"}
        </button>
      )}
    </div>
  );
}
