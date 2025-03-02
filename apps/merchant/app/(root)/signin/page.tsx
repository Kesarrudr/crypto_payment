"use client";
import { useState } from "react";
import { RegisterMerchantType as UserDataInter } from "@repo/api";
import { useLoginHook } from "../../hooks/loginMerchant";
import { useMerchantContext } from "../../context";
import { useRouter } from "next/navigation";
import { mintDetails } from "../../constant";
import { useCreateAccount } from "../../hooks";

export default function page() {
  const router = useRouter();

  const [userData, setUserData] = useState<UserDataInter>({
    username: "",
    password: "",
  });

  const { isLoading, loginMerchant } = useLoginHook();

  const [selectedMint, setSelectedMint] = useState("");
  const { isLoading: createAccountLoading, createAccount } = useCreateAccount();
  const { setMerchantData } = useMerchantContext();
  const [showMintSelection, setShowMintSelection] = useState(false);

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setUserData((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit() {
    //TODO: add mechant details context on this route and dashboard route
    const response = await loginMerchant(userData);
    if (response.status === "success") {
      localStorage.setItem("token", response.data.AuthToken);
      setMerchantData({
        username: userData.username,
        publicKey: response.data.WalletAddress,
        mint: "",
      });

      console.log("set the auth token now choose your mint");
      setShowMintSelection(true);
    }
  }

  //WARNING: show the mint to accept balance in the register route;

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
      </div>

      {showMintSelection && (
        <div>
          <h3>Select a Mint</h3>
          {mintDetails.map((mint) => (
            <div key={mint.mintAddress}>
              <input
                type="radio"
                id={mint.mintName}
                name="mint"
                value={mint.mintAddress}
                onChange={() => setSelectedMint(mint.mintAddress)}
              />
              <label htmlFor={mint.mintName}>{mint.mintName}</label>
            </div>
          ))}
          <button
            onClick={async () => {
              const response = await createAccount(selectedMint);
              if (response?.status === 200) {
                router.push("/dashboard");
              }
            }}
          >
            Create Account
          </button>
        </div>
      )}
    </div>
  );
}
