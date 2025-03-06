import { JwtPayload } from "jsonwebtoken";
import z from "zod";
import { Request } from "express";
import {
  associatedTokenAccountDetails,
  getMerchantTx,
  merchantUserName,
  registerMerchant,
  tokenDeatils,
} from "../dataBase";
import { getNewAccount } from "./helperFunctions";

// Schema for registering a merchant
const RegisterMerchantSchema = z.object({
  username: z
    .string()
    .nonempty("Username can't be empty")
    .max(10, "Username can be a maximum of 10 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(10, "Password can be a maximum of 10 characters")
    .nonempty("Password is required"),
});

const MerchantUserNameQuery = z
  .object({
    username: z.string().nonempty("Can't be empty"),
  })
  .strict("not a valid query");

const tokenDetailsSerchQuery = z
  .object({
    token: z.string().nonempty("Can't be empty"),
  })
  .strict("not a valid query");

type merchantUserNameType = z.infer<typeof MerchantUserNameQuery>;
type tokenDetailsType = z.infer<typeof tokenDetailsSerchQuery>;
type RegisterMerchantType = z.infer<typeof RegisterMerchantSchema>;

interface TokenData extends JwtPayload {
  id: string;
  publicKey: string;
}

interface CustomRequest extends Request {
  merchantData: {
    username: string;
    publicKey: string;
  };
}
enum StatusEnum {
  success = "success",
  error = "error",
}
interface SendResponseType<T> {
  status: StatusEnum;
  message: String;
  data: T;
}

//DATA Return form the backend if req has status code 200;
type RegisterMerchantDataType = Awaited<ReturnType<typeof registerMerchant>>;
type LoginMerchantDataType = {
  AuthToken: string;
  WalletAddress: string;
};
type GetAccountDataType = Awaited<
  ReturnType<typeof associatedTokenAccountDetails>
>;
type NewAccountDataType = Awaited<ReturnType<typeof getNewAccount>>;
type GetMerchantDetailsType = Awaited<ReturnType<typeof merchantUserName>>;
type GetTokenDeatailsDataType = Awaited<ReturnType<typeof tokenDeatils>>;
type MerchantTxDataType = Awaited<ReturnType<typeof getMerchantTx>>;

// Export schemas
export {
  RegisterMerchantSchema,
  MerchantUserNameQuery,
  tokenDetailsSerchQuery,
  StatusEnum,
  type tokenDetailsType,
  type merchantUserNameType,
  type RegisterMerchantType,
  type TokenData,
  type CustomRequest,
  type RegisterMerchantDataType,
  type LoginMerchantDataType,
  type GetAccountDataType,
  type NewAccountDataType,
  type GetMerchantDetailsType,
  type GetTokenDeatailsDataType,
  type SendResponseType,
  type MerchantTxDataType,
};
