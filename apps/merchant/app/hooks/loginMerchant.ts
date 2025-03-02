import { RegisterMerchantType } from "@repo/api";
import axios from "axios";
import { useState } from "react";

const useLoginHook = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loginMerchant = async (userInputData: RegisterMerchantType) => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        "http://localhost:6969/api/v1/v2/user/signin",
        userInputData,
      );

      return response.data;
    } catch (error) {
      //TODO: do error handling
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, loginMerchant };
};

export { useLoginHook };
