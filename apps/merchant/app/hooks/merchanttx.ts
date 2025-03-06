import { MerchantTxDataType, SendResponseType } from "@repo/api";
import { axiosGetRequest } from "@repo/axios-config";
import { useState } from "react";

const useMerchantTx = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getMerchantTx = async (): Promise<
    SendResponseType<MerchantTxDataType>
  > => {
    try {
      setIsLoading(true);
      return await axiosGetRequest<MerchantTxDataType>("/merchant/transaction");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, getMerchantTx };
};

export { useMerchantTx };
