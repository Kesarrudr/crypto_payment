import {
  getOrCreateAssociatedTokenAccount,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
} from "@solana/spl-token";
import { Connection, Keypair, PublicKey, Signer } from "@solana/web3.js";
import bcrypt from "bcrypt";
import bs58 from "bs58";
import { RequestHandler, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import {
  associatedTokenAccountDetails,
  merchantKeysDetails,
  storeAssociatedAccount,
  transactionSave,
} from "../dataBase/database.js";
import { AppError } from "./AppError.js";
import { USDC_TOKEN_ADDRESS } from "../Constants/index.js";
import { StatusEnum, TransactionType } from "./zod.js";

enum StatusCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,

  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,

  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

interface registeredUser {
  id: string;
  username: string;
  publicKey: string;
}

const sendRespnse = (
  res: Response,
  statusCode: StatusCode,
  status: StatusEnum,
  message: string,
  data: any = null,
) => {
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const getHashPassword = async (plainPassword: string): Promise<string> => {
  const hashPassword = await bcrypt.hash(plainPassword, 10);
  return hashPassword;
};

const checkPassword = async (
  hashPassword: string,
  enteredPasswrod: string,
): Promise<boolean> => {
  const check = await bcrypt.compare(enteredPasswrod, hashPassword);

  return check;
};

const generateToken = async ({ id, publicKey }: registeredUser) => {
  const token = jwt.sign(
    { id: id, publicKey: publicKey },
    process.env.JWT_SECRET as Secret,
    {
      expiresIn: "1week",
    },
  );

  return token;
};

const getNewAccount = async (
  username: string,
  publicKey: string,
  connection: Connection,
) => {
  const alreadyAccount = await associatedTokenAccountDetails(
    username,
    publicKey,
  );

  if (alreadyAccount) {
    return alreadyAccount;
  }
  const keyDetails = await merchantKeysDetails(publicKey, username);

  const account = await newAccount(
    connection,
    keyDetails.privateKey,
    publicKey,
  );

  const details = await storeAssociatedAccount(username, publicKey, account);

  return details;
};

const newAccount = async (
  connection: Connection,
  payerPrivateKey: string,
  owner: string,
) => {
  const payer: Signer = Keypair.fromSecretKey(bs58.decode(payerPrivateKey));
  const mintKey: PublicKey = new PublicKey(USDC_TOKEN_ADDRESS);
  const ownerKey: PublicKey = new PublicKey(owner);
  try {
    const account = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mintKey,
      ownerKey,
    );

    return account;
  } catch (error) {
    if (
      error instanceof TokenAccountNotFoundError ||
      error instanceof TokenInvalidAccountOwnerError
    ) {
      throw new AppError(
        "Don't have enough sol to make a new Account.",
        StatusCode.NOT_FOUND,
      );
    }
    throw new AppError(
      `Can't make account for ${owner} wallet for ${USDC_TOKEN_ADDRESS} mint`,
      StatusCode.CONFLICT,
      false,
    );
  }
};

const saveTx = async (txData: TransactionType) => {
  const swapRate = Number(txData.USDCAmount) / Number(txData.tokenAmount);
  await transactionSave(txData, swapRate);
};

const reqHandler = (handler: RequestHandler): RequestHandler[] => [
  handler as RequestHandler,
];

export {
  saveTx,
  checkPassword,
  generateToken,
  getHashPassword,
  getNewAccount,
  newAccount,
  sendRespnse,
  StatusCode,
  reqHandler,
};
