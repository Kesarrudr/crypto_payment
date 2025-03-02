import {
  createAssociatedTokenAccount,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Connection, Keypair, PublicKey, Signer } from "@solana/web3.js";
import bcrypt from "bcrypt";
import bs58 from "bs58";
import { Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import {
  acceptedMint,
  merchantKeysDetails,
  storeAssociatedAccount,
} from "../dataBase/database";
import { MerchantDetialsType } from "./zod";
import { AppError } from "./AppError";

enum StatusEnum {
  success = "success",
  error = "error",
}

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
  { username, publickey, mint }: MerchantDetialsType,
  connection: Connection,
) => {
  const mintDetails = await acceptedMint(mint);

  const keyDetails = await merchantKeysDetails(publickey, username);

  const account = await newAccount(
    connection,
    keyDetails.privateKey,
    mintDetails.mint,
    keyDetails.publicKey,
  );

  await storeAssociatedAccount(
    keyDetails.username,
    keyDetails.publicKey,
    account,
  );

  return account;
};

const newAccount = async (
  connection: Connection,
  payerPrivateKey: string,
  mint: string,
  owner: string,
) => {
  const payer: Signer = Keypair.fromSecretKey(bs58.decode(payerPrivateKey));
  const mintKey: PublicKey = new PublicKey(mint);
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
    console.log(error);
    throw new AppError(
      `Can't make account for ${mint} wallet for ${mint} mint`,
      StatusCode.CONFLICT,
      false,
    );
  }
};

export {
  checkPassword,
  generateToken,
  getHashPassword,
  getNewAccount,
  newAccount,
  sendRespnse,
  StatusCode,
  StatusEnum,
};
