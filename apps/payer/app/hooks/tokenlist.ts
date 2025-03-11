import { useState } from "react";
import { axiosGetRequest } from "../../axios-config/config";
import { GetTokenDeatailsDataType, StatusEnum } from "@repo/api";

const useTokenListSearchQery = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const tokenListSearch = async (name: string) => {
    if (!name) return;

    try {
      setIsLoading(true);

      const response = await axiosGetRequest<GetTokenDeatailsDataType>(
        `user/token?token=${name}`,
      );

      if (response.status === StatusEnum.success && response.data) {
        return response.data;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, tokenListSearch };
};

export { useTokenListSearchQery };
