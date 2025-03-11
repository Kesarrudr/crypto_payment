import { useState, useCallback, useRef, useEffect } from "react";
import debounce from "lodash.debounce";
import { TokenReturnDatatype } from "@repo/api";
import { useTokenListSearchQery } from "@/app/hooks";
import { ChevronUp, ChevronDown, Search } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface TokenInputProps {
  setSelectedToken: (token: TokenReturnDatatype) => void;
  selectedToken: TokenReturnDatatype;
}

export default function TokenInput({
  setSelectedToken,
  selectedToken,
}: TokenInputProps) {
  const [searchToken, setSearchToken] = useState<string>("");
  const [tokenResults, setTokenResults] = useState<TokenReturnDatatype[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { tokenListSearch, isLoading } = useTokenListSearchQery();

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setTokenResults([]);
        return;
      }
      const results = await tokenListSearch(query);
      if (results) setTokenResults(results);
    }, 500),
    [],
  );

  const handleSelectToken = (token: TokenReturnDatatype) => {
    setSelectedToken(token);
    setSearchToken("");
    setTokenResults([]);
    setShowDropdown(false);
  };

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

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Pay With
      </label>
      <div className="relative" ref={dropdownRef}>
        <div
          className="flex items-center justify-between p-3 bg-gray-700/50 border border-gray-600 rounded-lg cursor-pointer text-white"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {selectedToken ? (
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center mr-3 overflow-hidden">
                {selectedToken.logoURL ? (
                  <Image
                    src={selectedToken.logoURL || "/placeholder.svg"}
                    alt={selectedToken.symbol}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-xs font-bold">
                    {selectedToken.symbol.substring(0, 2)}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium">{selectedToken.symbol}</p>
                <p className="text-xs text-gray-400">{selectedToken.name}</p>
              </div>
            </div>
          ) : (
            <span className="text-gray-400">Select a token</span>
          )}
          {showDropdown ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>

        {/* Token Dropdown */}
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
                    value={searchToken}
                    onChange={(e) => {
                      setSearchToken(e.target.value);
                      debouncedSearch(e.target.value);
                    }}
                    placeholder="Search tokens..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div className="max-h-60 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-4">
                      <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : tokenResults.length > 0 ? (
                    <div className="space-y-1">
                      {tokenResults.map((token) => (
                        <div
                          key={token.tokenAddress}
                          className="flex items-center p-2 hover:bg-gray-700 rounded-md cursor-pointer transition-colors"
                          onClick={() => handleSelectToken(token)}
                        >
                          <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center mr-3 overflow-hidden">
                            {token.logoURL ? (
                              <Image
                                src={token.logoURL || "/placeholder.svg"}
                                alt={token.symbol}
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-xs font-bold">
                                {token.symbol.substring(0, 2)}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {token.symbol}
                            </p>
                            <p className="text-xs text-gray-400">
                              {token.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchToken ? (
                    <p className="text-center py-4 text-gray-400">
                      No tokens found
                    </p>
                  ) : (
                    <p className="text-center py-4 text-gray-400">
                      Type to search tokens
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
