"use client";

import { MerchantTxDataType, StatusEnum } from "@repo/api";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useAuthSession } from "../../../context/session";
import { useMerchantTx } from "../../hooks";

const Dashboard = () => {
  const { user, status } = useAuthSession();
  const [merchantTx, setMerchantTx] = useState<MerchantTxDataType | null>(null);
  const { isLoading, getMerchantTx } = useMerchantTx();

  useEffect(() => {
    const fetchMerchantTx = async () => {
      try {
        const data = await getMerchantTx();
        if (data.status === StatusEnum.success && data.data) {
          setMerchantTx(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch merchant transactions:", error);
      }
    };

    fetchMerchantTx();
  }, []); // <-- Empty dependency array ensures it runs only once

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>You need to log in.</p>;

  // Fetch merchant transactions once on mount
  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome, <span className="text-blue-600">{user?.username}</span>
      </h1>

      <p className="text-gray-700 text-lg mb-2">
        <span className="font-semibold">Your Wallet Address:</span>
        <span className="text-blue-500 break-all">{user?.publicKey}</span>
      </p>

      <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-64">
        <pre className="text-sm text-gray-700">
          {JSON.stringify(merchantTx, null, 2)}
        </pre>
      </div>

      <button
        onClick={() => signOut({ callbackUrl: "/signin" })}
        className="mt-5 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-all"
      >
        Sign out
      </button>
    </div>
  );
};

export default Dashboard;
