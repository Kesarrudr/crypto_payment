import { JwtPayload } from "jsonwebtoken";
import z from "zod";
import { Request } from "express";
import {
  associatedTokenAccountDetails,
  getBalance,
  getMerchantTx,
  merchantUserName,
  registerMerchant,
  tokenDeatils,
} from "../dataBase/index.js";
import { getNewAccount } from "./helperFunctions.js";
import { TxStatus } from "@repo/database";

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
const LoginMerchantSchema = z
  .object({
    username: z.string().nonempty("Username can't be empty"),
    password: z.string().nonempty("Password is required"),
  })
  .strict();

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

const txSkipQuerySchema = z.object({
  skip: z
    .string()
    .regex(/^\d+$/, "Must be a string containing only numbers")
    .optional(),
});

const TransactionSchema = z
  .object({
    tokenAmount: z.string().nonempty("Can't be empty"),
    tokenAddress: z.string().nonempty("token Address not provided"),
    payerAddress: z.string().nonempty("Payer Address missing"),
    signature: z.string().nonempty("signature required"),
    USDCAmount: z.string().nonempty("amount needed"),
    Status: z.nativeEnum(TxStatus),
    date: z.string().nonempty("Date Required"),
    time: z.string().nonempty("Time required"),
    merchantUserName: z.string().nonempty("username required"),
  })
  .strict("Not a valid body");

type TransactionType = z.infer<typeof TransactionSchema>;
type txSkipQueryData = z.infer<typeof txSkipQuerySchema>;
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

type MerchantTransactionType =
  NonNullable<MerchantTxDataType>["MerchantTransaction"][number];
type MerchantReturnDataType = NonNullable<GetMerchantDetailsType>[number];
type TokenReturnDatatype = NonNullable<GetTokenDeatailsDataType>[number];
type LoginMerchantType = z.infer<typeof LoginMerchantSchema>;
type GetMerchantBalance = Awaited<ReturnType<typeof getBalance>>;

// Export schemas
export {
  LoginMerchantSchema,
  RegisterMerchantSchema,
  MerchantUserNameQuery,
  tokenDetailsSerchQuery,
  txSkipQuerySchema,
  TransactionSchema,
  StatusEnum,
  type TokenReturnDatatype,
  type GetMerchantBalance,
  type MerchantReturnDataType,
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
  type LoginMerchantType,
  type txSkipQueryData,
  type MerchantTransactionType,
  type TransactionType,
};
