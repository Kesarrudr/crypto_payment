import { Request, Response } from "express";
import {
  AppError,
  asyncHandler,
  merchantUserName,
  MerchantUserNameQuery,
  merchantUserNameType,
  sendRespnse,
  StatusCode,
  StatusEnum,
  tokenDeatils,
  tokenDetailsSerchQuery,
  tokenDetailsType,
} from "../../utilis";
import { SafeParseReturnType } from "zod";

const getMerchantUserName = asyncHandler(
  async (req: Request, res: Response) => {
    const queryData = req.query;

    const parseusername: SafeParseReturnType<any, merchantUserNameType> =
      MerchantUserNameQuery.safeParse(queryData);

    if (!parseusername.success) {
      throw new AppError(
        parseusername.error.errors[0].message,
        StatusCode.BAD_REQUEST,
      );
    }

    const merchantusername = await merchantUserName(
      parseusername.data.username,
    );

    sendRespnse(
      res,
      StatusCode.OK,
      StatusEnum.success,
      "Merchant Query Result",
      merchantusername,
    );
  },
);

const getTokenDetails = asyncHandler(async (req: Request, res: Response) => {
  const queryData = req.query;

  const parseTokenName: SafeParseReturnType<any, tokenDetailsType> =
    tokenDetailsSerchQuery.safeParse(queryData);

  if (!parseTokenName.success) {
    throw new AppError(
      parseTokenName.error.errors[0].message,
      StatusCode.BAD_REQUEST,
    );
  }

  const details = await tokenDeatils(parseTokenName.data.token);

  sendRespnse(
    res,
    StatusCode.OK,
    StatusEnum.success,
    "Merchant Query Result",
    details,
  );
});

export { getMerchantUserName, getTokenDetails };
