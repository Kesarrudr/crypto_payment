"use client";

import {
  GetAccountDataType,
  MerchantTransactionType,
  MerchantTxDataType,
} from "@repo/api";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useAuthSession } from "../../../context/session";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  Loader,
  LogOut,
  RefreshCw,
  Wallet,
} from "lucide-react";
import { useAccountHook, useBalanceHook } from "@/app/hooks";
import { useTranscationHook } from "@/app/hooks/tx";
import { useRouter } from "next/navigation";
import TransactionDetailsModal from "@/components/transaction-detail";
import Image from "next/image";

const Dashboard = () => {
  const router = useRouter();
  const { user, status } = useAuthSession();

  const [merchantTx, setMerchantTx] = useState<MerchantTxDataType>();
  const [account, setAccount] = useState<GetAccountDataType>();
  const [skip, setSkip] = useState<number>(0);
  const [balance, setBalance] = useState<string>();
  const [copied, setCopied] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<MerchantTransactionType | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const {
    isLoading: accountLoading,
    getAccount,
    createAccount,
  } = useAccountHook();
  const { isLoading: txLoading, getTranscation } = useTranscationHook();
  const { isLoading: balanceLoading, getMerchantBalance } = useBalanceHook();

  useEffect(() => {
    const fetchDetails = async () => {
      const accountData = await getAccount();
      if (accountData) {
        setAccount(accountData);

        const balanceData = await getMerchantBalance();
        if (balanceData) setBalance(balanceData.toString());

        const tx = await getTranscation(skip);
        if (tx) setMerchantTx(tx);
      } else {
        setAccount(null);
      }
    };

    fetchDetails();
  }, []);

  useEffect(() => {
    const fetchTx = async () => {
      if (account) {
        const tx = await getTranscation(skip);
        if (tx) setMerchantTx(tx);
      }
    };
    fetchTx();
  }, [skip, account]);

  const updateBalance = async () => {
    const balanceData = await getMerchantBalance();
    if (balanceData) setBalance(balanceData.toString());
  };

  const handleCreateAccount = async () => {
    setIsCreatingAccount(true);
    const accountData = await createAccount();
    //WARNING: user might not have not put the sol so this call might fall.
    if (accountData) {
      setAccount(accountData);

      const balanceData = await getMerchantBalance();
      if (balanceData) setBalance(balanceData.toString());

      const tx = await getTranscation(0);
      if (tx) setMerchantTx(tx);
    } else {
      setAccount(null);
    }

    setIsCreatingAccount(false);
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/signin");
  };

  const formatTokenAmount = (amount: string, decimals: number) => {
    const value = Number.parseFloat(amount) / Math.pow(10, decimals);
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  };

  const openTransactionDetails = (tx: MerchantTransactionType) => {
    setSelectedTransaction(tx);
    setIsTransactionModalOpen(true);
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center">
          <Loader className="w-12 h-12 animate-spin text-blue-500 mb-4" />
          <p className="text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950">
      {/* Header */}
      <header className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mr-3">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Web3 Payments</h1>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome, {user?.username}
          </h2>
          <p className="text-gray-400">Manage your payments and transactions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Account Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Wallet className="h-5 w-5 mr-2 text-blue-400" />
                  Account Details
                </h3>

                {accountLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
                ) : account ? (
                  <div>
                    <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">
                            Public Key
                          </p>
                          <div className="flex items-center">
                            <p className="font-mono text-sm text-gray-200 truncate max-w-[240px] md:max-w-md">
                              {user?.publicKey}
                            </p>
                            <button
                              onClick={() =>
                                copyToClipboard(user?.publicKey || "")
                              }
                              className="ml-2 p-1.5 rounded-md hover:bg-gray-600 transition-colors"
                              title="Copy to clipboard"
                            >
                              {copied ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                            <a
                              href={`https://explorer.solana.com/address/${user?.publicKey}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-1 p-1.5 rounded-md hover:bg-gray-600 transition-colors"
                              title="View on Solana Explorer"
                            >
                              <ExternalLink className="h-4 w-4 text-gray-400" />
                            </a>
                          </div>
                        </div>
                        <div className="mt-3 md:mt-0">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              account
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {account ? "Initialized" : "Not Initialized"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Balance Section */}
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-gray-400">Current Balance</p>
                        <button
                          onClick={updateBalance}
                          disabled={balanceLoading}
                          className="flex items-center text-xs px-2 py-1 rounded bg-gray-600 hover:bg-gray-500 text-gray-300 transition-colors disabled:opacity-50"
                        >
                          {balanceLoading ? (
                            <Loader className="h-3 w-3 animate-spin mr-1" />
                          ) : (
                            <RefreshCw className="h-3 w-3 mr-1" />
                          )}
                          Refresh
                        </button>
                      </div>
                      <div className="flex items-baseline">
                        <h4 className="text-2xl font-bold text-white mr-2">
                          {balanceLoading ? (
                            <div className="h-8 w-24 bg-gray-600/50 animate-pulse rounded"></div>
                          ) : (
                            balance
                          )}
                        </h4>
                        <span className="text-blue-400 font-medium">USDC</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-700/50 rounded-lg p-6 border border-amber-500/20">
                    <div className="flex items-start mb-4">
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-medium mb-1">
                          Account Not Found
                        </h4>
                        <p className="text-gray-400 text-sm mb-4">
                          To use the payment platform, you need to create an
                          account. Please deposit at least 0.1 SOL to the
                          address below and click "Create Account".
                        </p>
                        <div className="bg-gray-800/80 rounded-lg p-3 mb-4">
                          <p className="text-xs text-gray-400 mb-1">
                            Deposit to this address:
                          </p>
                          <div className="flex items-center">
                            <p className="font-mono text-sm text-gray-200 truncate">
                              {user?.publicKey}
                            </p>
                            <button
                              onClick={() =>
                                copyToClipboard(user?.publicKey as string)
                              }
                              className="ml-2 p-1.5 rounded-md hover:bg-gray-600 transition-colors"
                              title="Copy to clipboard"
                            >
                              {copied ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={handleCreateAccount}
                          disabled={isCreatingAccount}
                          className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-70 flex items-center justify-center"
                        >
                          {isCreatingAccount ? (
                            <>
                              <Loader className="h-4 w-4 animate-spin mr-2" />
                              Creating Account...
                            </>
                          ) : (
                            "Create Account"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-400" />
                Recent Transactions
              </h3>

              {txLoading ? (
                <div className="flex justify-center py-12">
                  <div className="flex flex-col items-center">
                    <Loader className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                    <p className="text-gray-400">Loading transactions...</p>
                  </div>
                </div>
              ) : merchantTx && merchantTx.MerchantTransaction.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs text-gray-400 border-b border-gray-700">
                          <th className="pb-3 font-medium">Token</th>
                          <th className="pb-3 font-medium">Amount</th>
                          <th className="pb-3 font-medium">Payer</th>
                          <th className="pb-3 font-medium">Date & Time</th>
                          <th className="pb-3 font-medium">Status</th>
                          <th className="pb-3 font-medium">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {merchantTx.MerchantTransaction.map(
                          (tx: MerchantTransactionType) => (
                            <tr
                              key={tx.signature}
                              className="border-b border-gray-700/50 hover:bg-gray-700/20"
                            >
                              <td className="py-4">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mr-3 overflow-hidden">
                                    {tx.token.logoURL ? (
                                      <Image
                                        src={
                                          tx.token.logoURL || "/placeholder.svg"
                                        }
                                        alt={tx.token.symbol}
                                        width={32}
                                        height={32}
                                        className="object-cover"
                                      />
                                    ) : (
                                      <span className="text-xs font-bold">
                                        {tx.token.symbol.substring(0, 2)}
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-white">
                                      {tx.token.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {tx.token.symbol}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4">
                                <p className="text-sm font-medium text-white">
                                  {formatTokenAmount(
                                    tx.tokenAmount.toString(),
                                    tx.token.decimals,
                                  )}
                                </p>
                                <p className="text-xs text-gray-400">
                                  ${tx.USDTAmount.toLocaleString()}
                                </p>
                              </td>
                              <td className="py-4">
                                <p
                                  className="text-sm font-medium text-white truncate max-w-[120px]"
                                  title={tx.payerAddress}
                                >
                                  {tx.payerAddress.substring(0, 8)}...
                                </p>
                              </td>
                              <td className="py-4">
                                <p className="text-sm font-medium text-white">
                                  {tx.Date}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {tx.Time}
                                </p>
                              </td>
                              <td className="py-4">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    tx.Status === "success"
                                      ? "bg-green-500/20 text-green-400"
                                      : "bg-red-500/20 text-red-400"
                                  }`}
                                >
                                  {tx.Status.charAt(0).toUpperCase() +
                                    tx.Status.slice(1)}
                                </span>
                              </td>
                              <td className="py-4">
                                <button
                                  onClick={() => openTransactionDetails(tx)}
                                  className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 transition-colors"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex justify-between items-center mt-6">
                    <p className="text-sm text-gray-400">
                      Showing {20 * skip + 1} to {20 * skip + 10}, of{" "}
                      {merchantTx._count.MerchantTransaction} transactions
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSkip(skip - 1)}
                        disabled={skip === 0 || txLoading}
                        className="flex items-center px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </button>
                      <button
                        onClick={() => setSkip(skip + 1)}
                        disabled={
                          merchantTx.MerchantTransaction.length === 0 ||
                          txLoading
                        }
                        className="flex items-center px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-gray-700/50 flex items-center justify-center mb-4">
                    <Clock className="h-8 w-8 text-gray-500" />
                  </div>
                  <h4 className="text-lg font-medium text-white mb-2">
                    No Transactions Yet
                  </h4>
                  <p className="text-gray-400 max-w-md">
                    Your transaction history will appear here once you start
                    receiving payments.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800/30 border-t border-gray-800 py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mr-2">
                <Wallet className="h-4 w-4 text-white" />
              </div>
              <p className="text-gray-400 text-sm">Web3 Payments Platform</p>
            </div>
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Web3 Payments. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          isOpen={isTransactionModalOpen}
          onClose={() => setIsTransactionModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
