import { useState } from "react";
import { useMerchantContext } from "../context";
import axios from "axios";
const useCreateAccount = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { merchantData: userData } = useMerchantContext();

  const createAccount = async (mint: string) => {
    if (!mint) {
      alert("Mint address not found");
      return;
    }
    try {
      setIsLoading(true);
      const authToken = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:6969/api/v1/v2/user/newaccount",
        {
          username: userData?.username,
          publickey: userData?.publicKey,
          mint: mint,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        },
      );
      return response;
    } catch (error) {
      //TODO: do better error handling
      console.error("Account creation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return { isLoading, createAccount };
};

export { useCreateAccount };
