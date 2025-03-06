import axios from "axios";
import { useState } from "react";

const useTokenListSearchQery = () => {
  //TODO: currenty not showing the associated token account
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //TODO: only return the token list let
  const tokenListSearch = async (name: string) => {
    if (!name) return;

    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:6969/api/v1/user/gettoken?token=${name}`,
      );

      if (response.status === 200) {
        return response.data.data;
      }
    } catch (error) {
      console.error("Error fetching merchant details", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, tokenListSearch };
};

export { useTokenListSearchQery };
