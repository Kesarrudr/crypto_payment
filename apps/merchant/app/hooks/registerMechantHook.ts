import { axiosPostRequest } from "@/axios-config/axios";
import {
  RegisterMerchantDataType,
  RegisterMerchantType,
  SendResponseType,
} from "@repo/api";
import { useState } from "react";

const useRegisterHook = () => {
  const [isLoading, setIsLoading] = useState(false);

  const registerMerchant = async (
    userInputData: RegisterMerchantType,
  ): Promise<SendResponseType<RegisterMerchantDataType>> => {
    try {
      setIsLoading(true);
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
