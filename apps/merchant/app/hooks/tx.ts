import { axiosGetRequest } from "@/axios-config/axios";
import { MerchantTxDataType } from "@repo/api";
import { useState } from "react";

const useTranscationHook = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getTranscation = async (skip: number) => {
    try {
      setIsLoading(true);
      const tx = await axiosGetRequest<MerchantTxDataType>(
        `/merchant/transaction?skip=${skip}`,
      );
      if (tx.data) {
        return tx.data;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, getTranscation };
};

export { useTranscationHook };
