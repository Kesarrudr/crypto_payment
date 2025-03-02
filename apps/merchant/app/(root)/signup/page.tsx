"use client";
import { useState } from "react";
import { RegisterMerchantType as UserDataInter } from "@repo/api";
import { usereigsterHook } from "../../hooks";
import { useRouter } from "next/navigation";

export default function IndexPage() {
  const router = useRouter();

  const { registerMerchant } = usereigsterHook();

  const [userData, setUserData] = useState<UserDataInter>({
    username: "",
    password: "",
  });
  const [data, setData] = useState();

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setUserData((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit() {
    const response = await registerMerchant(userData);
    setData(response.data);
    if (response.status === "success") {
      router.push("/signin");
    }
    //TODO: show the card to display the wallet address and the mnemonic(phrase) and push the user to /signin route
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
        <input
          id="username"
          type="text"
          placeholder="Username"
          onChange={handleOnChange}
          value={userData.username}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <input
          id="password"
          type="password"
          placeholder="Password"
          onChange={handleOnChange}
          value={userData.password}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <p>{data ? JSON.stringify(data, null, 2) : "No data available"}</p>
      </div>
    </div>
  );
}
