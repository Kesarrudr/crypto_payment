import { TransactionType } from "@repo/api";
import { axiosPostRequest } from "../../axios-config/config";

const saveTx = async (txData: TransactionType) => {
  await axiosPostRequest<TransactionType, any>("/user/tx", txData);
};

export { saveTx };
