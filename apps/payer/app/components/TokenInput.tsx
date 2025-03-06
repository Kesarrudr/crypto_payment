"use client";

import { useState, useCallback } from "react";
import debounce from "lodash.debounce";
import { useTokenListSearchQery } from "../hooks";

interface Token {
  tokenAddress: string;
  name: string;
  symbol: string;
  logoURL?: string;
  decimals: number;
}

export default function TokenInput({
  setSelectedToken,
}: {
  setSelectedToken: (token: Token) => void;
}) {
  const [searchToken, setSearchToken] = useState<string>("");
  const [tokenResults, setTokenResults] = useState<Token[]>([]);
  const { tokenListSearch, isLoading } = useTokenListSearchQery();

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setTokenResults([]);
        return;
      }
      const results = await tokenListSearch(query);
      setTokenResults(results || []);
    }, 500),
    [],
  );

  return (
    <div>
      {/* Token Search Input */}
      <input
        type="text"
        placeholder="Search token"
        className="border p-2 w-full mb-2"
        value={searchToken}
        onChange={(e) => {
          setSearchToken(e.target.value);
          debouncedSearch(e.target.value);
        }}
      />

      {/* Token List */}
      {isLoading ? (
        <p>Loading tokens...</p>
      ) : tokenResults.length > 0 ? (
        <ul className="border rounded max-h-40 overflow-y-auto">
          {tokenResults.map((token) => (
            <li
              key={token.tokenAddress}
              className="p-2 cursor-pointer hover:bg-gray-100 flex items-center"
              onClick={() => {
                setSelectedToken(token); // Update the state in parent
                setSearchToken(token.symbol); // Update input
                setTokenResults([]); // Clear search results
              }}
            >
              {token.logoURL && (
                <img
                  src={token.logoURL}
                  alt={token.name}
                  className="w-6 h-6 mr-2"
                />
              )}
              {token.symbol} ({token.name})
            </li>
          ))}
        </ul>
      ) : (
        searchToken && <p>No tokens found.</p>
      )}
    </div>
  );
}
