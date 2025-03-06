"use client";

import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import { useMerchantSearchQuery, useSendSwapTransaction } from "../hooks";
import { useWallet } from "@solana/wallet-adapter-react";

interface MerchantType {
  username: string;
  publicKey: string;
  AssociatedTokenAccount: string;
}

interface Props {
  quote: string;
}

export default function MerchantInputSearch({ quote }: Props) {
  const [searchUsername, setSearchUsername] = useState<string>("");
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantType | null>(
    null,
  );
  const [merchants, setMerchants] = useState<MerchantType[]>([]);
  const { isLoading, merchantSearch } = useMerchantSearchQuery();
  const { connected } = useWallet();

  const { isLoading: sendTxLoading, sendSwapTransaction } =
    useSendSwapTransaction();

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      const results = await merchantSearch(query);
      if (results) setMerchants(results);
    }, 500),
    [],
  );

  async function handlerOnClick() {
    if (!selectedMerchant) return;
    const tx = await sendSwapTransaction(
      quote,
      selectedMerchant.AssociatedTokenAccount,
    );
    console.log("Transaction:", tx);
  }

  useEffect(() => {
    if (searchUsername.trim()) {
      debouncedSearch(searchUsername);
    } else {
      setMerchants([]);
    }
    return () => debouncedSearch.cancel();
  }, [searchUsername, debouncedSearch]);

  return (
    <div className="border border-gray-300 hover:border-slate-900 rounded p-4 mt-4">
      <input
        id="username"
        type="text"
        className="border p-2 w-full mb-4 rounded"
        placeholder="Search Merchant Username"
        onChange={(e) => setSearchUsername(e.target.value)}
        value={searchUsername}
      />

      <div>
        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : merchants.length > 0 ? (
          <ul className="list-disc pl-5">
            {merchants.map((merchant) => (
              <li
                key={merchant.publicKey}
                className={`p-2 border-b cursor-pointer ${
                  selectedMerchant?.publicKey === merchant.publicKey
                    ? "bg-blue-200"
                    : ""
                }`}
                onClick={() => setSelectedMerchant(merchant)}
              >
                <p>
                  <strong>Username:</strong> {merchant.username}
                </p>
                <p>
                  <strong>Public Key:</strong> {merchant.publicKey}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          searchUsername && <p className="text-gray-500">No results found.</p>
        )}
      </div>

      {selectedMerchant && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h3 className="font-bold">Selected Merchant:</h3>
          <p>
            <strong>Username:</strong> {selectedMerchant.username}
          </p>
          <p>
            <strong>Public Key:</strong> {selectedMerchant.publicKey}
          </p>
        </div>
      )}

      <button
        disabled={!connected || !selectedMerchant || sendTxLoading}
        className={`mt-4 w-full px-4 py-2 rounded text-white ${
          connected && selectedMerchant
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        onClick={handlerOnClick}
      >
        {sendTxLoading ? "Processing..." : "Pay"}
      </button>
    </div>
  );
}
