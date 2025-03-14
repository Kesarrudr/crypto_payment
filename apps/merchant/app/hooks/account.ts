import { axiosGetRequest, axiosPostRequest } from "@/axios-config/axios";
import { GetAccountDataType, NewAccountDataType, StatusEnum } from "@repo/api";
import { useState } from "react";

const useAccountHook = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getAccount = async () => {
    try {
      setIsLoading(true);

      const data =
        await axiosGetRequest<GetAccountDataType>("/merchant/account");
      if (data.data) {
        return data.data;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createAccount = async () => {
    try {
      setIsLoading(true);
      const account = await axiosPostRequest<any, NewAccountDataType>(
        "/merchant/newaccount",
      );
      if (account.status === StatusEnum.success && account.data) {
        return account.data;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, createAccount, getAccount };
};

export { useAccountHook };
