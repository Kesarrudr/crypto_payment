"use client";
import {
  RegisterMerchantDataType,
  StatusEnum,
  RegisterMerchantType as UserDataInter,
} from "@repo/api";
import { useRegisterHook } from "../../hooks";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  ChevronRight,
  Wallet,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function IndexPage() {
  const router = useRouter();

  const { registerMerchant } = useRegisterHook();

  const [userData, setUserData] = useState<UserDataInter>({
    username: "",
    password: "",
  });
  const [data, setData] = useState<RegisterMerchantDataType>();

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setUserData((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit() {
    const response = await registerMerchant(userData);

    if (response.status === StatusEnum.success && response.data) {
      setData(response.data);
    }

    console.log(response);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Register
        </h2>
        <div className="space-y-4">
          <input
            id="username"
            type="text"
            placeholder="Username"
            onChange={handleOnChange}
            value={userData.username}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            id="password"
            type="password"
            placeholder="Password"
            onChange={handleOnChange}
            value={userData.password}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition-all"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
        {data && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm">
            <pre className="text-gray-700">{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
