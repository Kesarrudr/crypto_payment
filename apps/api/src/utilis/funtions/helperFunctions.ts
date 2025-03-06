import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { Connection, Keypair, PublicKey, Signer } from "@solana/web3.js";
import bcrypt from "bcrypt";
import bs58 from "bs58";
import { RequestHandler, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import {
  associatedTokenAccountDetails,
  merchantKeysDetails,
  storeAssociatedAccount,
} from "../dataBase/database";
import { AppError } from "./AppError";
import { USDC_TOKEN_ADDRESS } from "../Constants";
import { StatusEnum } from "./zod";

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
    process.env.JWTSECRET || ("JWTSECRET" as Secret),
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

  await storeAssociatedAccount(username, publicKey, account);

  return {
    account: account.address.toBase58(),
    tokenAddress: account.mint.toBase58(),
  };
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
    throw new AppError(
      `Can't make account for ${owner} wallet for ${USDC_TOKEN_ADDRESS} mint`,
      StatusCode.CONFLICT,
      false,
    );
  }
};

const reqHandler = (handler: RequestHandler): RequestHandler[] => [
  handler as RequestHandler,
];

export {
  checkPassword,
  generateToken,
  getHashPassword,
  getNewAccount,
  newAccount,
  sendRespnse,
  StatusCode,
  reqHandler,
};
