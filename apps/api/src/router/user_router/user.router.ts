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

    sendRespnse(res, StatusCode.OK, StatusEnum.success, "query", queryData);
  },
);

export { getMerchantUserName };
