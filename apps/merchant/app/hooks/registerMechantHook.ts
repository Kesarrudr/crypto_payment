import { RegisterMerchantType } from "@repo/api";
import axios from "axios";
import { useState } from "react";

const usereigsterHook = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const registerMerchant = async (userInputData: RegisterMerchantType) => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        "http://localhost:6969/api/v1/v2/user/signup",
        userInputData,
      );

      return response.data;
    } catch (error) {
      //TODO: do error handling
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, registerMerchant };
};

export { usereigsterHook };
