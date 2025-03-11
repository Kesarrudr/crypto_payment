import { GetMerchantDetailsType, StatusEnum } from "@repo/api";
import { useState } from "react";
import { axiosGetRequest } from "../../axios-config/config";

const useMerchantSearchQuery = () => {
  //TODO: currenty not showing the associated token account
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //TODO: change this to only return the response data
  const merchantSearch = async (name: string) => {
    if (!name) return;

    try {
      setIsLoading(true);
      const response = await axiosGetRequest<GetMerchantDetailsType>(
        `user/merchant?username=${name}`,
      );

      if (response.status === StatusEnum.success) {
        return response.data;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, merchantSearch };
};

export { useMerchantSearchQuery };
