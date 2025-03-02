import { clusterApiUrl, Connection } from "@solana/web3.js";
import { Request, Response } from "express";
import { SafeParseReturnType } from "zod";
import {
  AppError,
  associatedTokenAccountDetails,
  asyncHandler,
  checkPassword,
  generateToken,
  getMerchantDetails,
  getNewAccount,
  MerchantDetialsSchema,
  merchantDetialsType,
  registerMerchant,
  RegisterMerchantSchema,
  RegisterMerchantType,
  sendRespnse,
  StatusCode,
  StatusEnum,
} from "../../utilis";
import { prisma } from "@repo/database";

//TODO: make this a package dependency so that both frontend and backend and use this
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const RegisterMerchant = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;

  const parseData: SafeParseReturnType<any, RegisterMerchantType> =
    RegisterMerchantSchema.safeParse(data);

  if (!parseData.success) {
    throw new AppError(
      parseData.error.errors[0].message,
      StatusCode.BAD_REQUEST,
    );
  }

  const newUser = await registerMerchant(parseData.data);
  sendRespnse(
    res,
    StatusCode.OK,
    StatusEnum.success,
    "Merchant RegisteredSuccessFull",
    newUser,
  );
});

const loginMerchant = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;
  const parseData: SafeParseReturnType<any, RegisterMerchantType> =
    RegisterMerchantSchema.safeParse(body);

  if (!parseData.success) {
    throw new AppError(
      parseData.error.errors[0].message,
      StatusCode.BAD_REQUEST,
    );
  }
  const registeredMerchant = await getMerchantDetails(parseData.data.username);

  const correctPassword: boolean = await checkPassword(
    registeredMerchant.password,
    parseData.data.password,
  );

  if (!correctPassword) {
    throw new AppError("Enter correct Password", StatusCode.BAD_REQUEST);
  }
  const token = await generateToken(registeredMerchant);

  sendRespnse(res, StatusCode.OK, StatusEnum.success, "Login Successfull", {
    AuthToken: token,
    WalletAddress: registeredMerchant.publicKey,
  });
});

const getAssociatedAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body;

    const parseData: SafeParseReturnType<any, merchantDetialsType> =
      MerchantDetialsSchema.safeParse(data);

    if (!parseData.success) {
      throw new AppError(
        parseData.error.errors[0].message,
        StatusCode.BAD_REQUEST,
      );
    }

    const associatedAccount = await associatedTokenAccountDetails(
      parseData.data,
    );

    sendRespnse(
      res,
      StatusCode.OK,
      StatusEnum.success,
      "From the associatedAccount",
      {
        account_Address: associatedAccount.accountAddress,
        mint: associatedAccount.stableTokenMint,
      },
    );
  },
);

const makeAssociatedAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body;

    const parseData: SafeParseReturnType<any, merchantDetialsType> =
      MerchantDetialsSchema.safeParse(data);

    if (!parseData.success) {
      throw new AppError(
        parseData.error.errors[0].message,
        StatusCode.BAD_REQUEST,
      );
    }

    //TODO: make a prisma call to make sure Associate Token Account do't not exits
    const newAccount = await getNewAccount(parseData.data, connection);

    sendRespnse(
      res,
      StatusCode.OK,
      StatusEnum.success,
      "Associated Account Details",
      {
        account: newAccount.address.toBase58(),
      },
    );
  },
);

//TODO: make this better
const newMint = asyncHandler(async (req: Request, res: Response) => {
  const { mint, username } = req.body;

  try {
    const addedMint = await prisma.stableToken.create({
      data: {
        mint: mint,
      },
    });
    console.log("newmint ", addedMint);
  } catch (error) {
    console.log(error);
  }
  sendRespnse(res, StatusCode.OK, StatusEnum.success, "Mint added");
});

export {
  loginMerchant,
  RegisterMerchant,
  getAssociatedAccount,
  makeAssociatedAccount,
  newMint,
};
