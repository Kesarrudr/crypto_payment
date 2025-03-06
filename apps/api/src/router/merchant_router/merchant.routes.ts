import { clusterApiUrl, Connection } from "@solana/web3.js";
import { Response } from "express";
import { SafeParseReturnType } from "zod";
import {
  AppError,
  associatedTokenAccountDetails,
  asyncHandler,
  checkPassword,
  CustomRequest,
  generateToken,
  getMerchantDetails,
  getMerchantTx,
  getNewAccount,
  registerMerchant,
  RegisterMerchantSchema,
  RegisterMerchantType,
  sendRespnse,
  StatusCode,
  StatusEnum,
} from "../../utilis";

//TODO: make this a package dependency so that both frontend and backend and use this
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const RegisterMerchant = asyncHandler(
  async (req: CustomRequest, res: Response) => {
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
  },
);

const loginMerchant = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const body = req.body;
    const parseData: SafeParseReturnType<any, RegisterMerchantType> =
      RegisterMerchantSchema.safeParse(body);

    if (!parseData.success) {
      throw new AppError(
        parseData.error.errors[0].message,
        StatusCode.BAD_REQUEST,
      );
    }
    const registeredMerchant = await getMerchantDetails(
      parseData.data.username,
    );

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
  },
);

const getAssociatedAccount = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { publicKey, username } = req.merchantData;
    const associatedAccount = await associatedTokenAccountDetails(
      username,
      publicKey,
    );

    sendRespnse(
      res,
      StatusCode.OK,
      StatusEnum.success,
      "From the associatedAccount",
      associatedAccount,
    );
  },
);

const makeAssociatedAccount = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { username, publicKey } = req.merchantData;

    const newAccount = await getNewAccount(username, publicKey, connection);

    sendRespnse(
      res,
      StatusCode.OK,
      StatusEnum.success,
      "Associated Account Details",
      newAccount,
    );
  },
);

const merchantTranscations = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { username, publicKey } = req.merchantData;
    const tx = await getMerchantTx(username, publicKey);
    sendRespnse(
      res,
      StatusCode.OK,
      StatusEnum.success,
      `${username} user tx details`,
      tx,
    );
  },
);

export {
  merchantTranscations,
  loginMerchant,
  RegisterMerchant,
  getAssociatedAccount,
  makeAssociatedAccount,
};
