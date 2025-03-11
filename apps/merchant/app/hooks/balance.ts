import { axiosGetRequest } from "@/axios-config/axios";
import { GetMerchantBalance } from "@repo/api";
import { useState } from "react";

const useBalanceHook = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getMerchantBalance = async () => {
    try {
      setIsLoading(true);
      const data =
        await axiosGetRequest<GetMerchantBalance>("/merchant/balance");
      if (data.data) {
        return data.data.Balance;
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { isLoading, getMerchantBalance };
};

export { useBalanceHook };
