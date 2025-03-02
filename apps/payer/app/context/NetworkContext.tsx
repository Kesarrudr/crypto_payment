import React, { createContext, useContext, useState } from "react";
import { WalletAdapterNetwork } from "../constant";

interface NetworkContextType {
  network: WalletAdapterNetwork;
  setNetwork: React.Dispatch<React.SetStateAction<WalletAdapterNetwork>>;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [network, setNetwork] = useState<WalletAdapterNetwork>(
    WalletAdapterNetwork.Mainnet,
  );

  return (
    <NetworkContext.Provider value={{ network, setNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error("useNetwork must be used with in a NetworkProvider");
  }

  return context;
};
