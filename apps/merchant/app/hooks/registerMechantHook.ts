import {
  RegisterMerchantDataType,
  RegisterMerchantType,
  SendResponseType,
} from "@repo/api";
import { useState } from "react";
import { axiosPostRequest } from "@repo/axios-config";

const useRegisterHook = () => {
  const [isLoading, setIsLoading] = useState(false);

  const registerMerchant = async (
    userInputData: RegisterMerchantType,
  ): Promise<SendResponseType<RegisterMerchantDataType>> => {
    setIsLoading(true);
    try {
      return await axiosPostRequest<
        RegisterMerchantType,
        RegisterMerchantDataType
      >("/merchant/signup", userInputData);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, registerMerchant };
};

export { useRegisterHook };
