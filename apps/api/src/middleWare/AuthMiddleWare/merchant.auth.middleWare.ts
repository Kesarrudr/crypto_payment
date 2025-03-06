import { NextFunction, Response } from "express";
import {
  AppError,
  asyncHandler,
  CustomRequest,
  merchantIDSearch,
  StatusCode,
  TokenData,
} from "../../utilis";

import jwt, { Secret } from "jsonwebtoken";

const MerchantAuthMiddleWare = asyncHandler(
  async (req: CustomRequest, _res: Response, next: NextFunction) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authorization Header Missing", StatusCode.NOT_FOUND);
    }
    const token = authHeader.split(" ")[1];

    //TODO: can make this more secure
    try {
      jwt.verify(token, process.env.JWTSECRET || ("JWTSECRET" as Secret));

      const decode = jwt.decode(token) as TokenData | null;

      if (!decode) {
        throw new AppError("Invalid Token", StatusCode.UNAUTHORIZED);
      }

      const { id: merchantId, publicKey } = decode;
      const merchant = await merchantIDSearch(merchantId, publicKey);

      req.merchantData = {
        username: merchant.username,
        publicKey: merchant.publicKey,
      };

      next();
    } catch (error) {
      console.log("error", error);
      throw new AppError("UNAUTHORIZED", StatusCode.UNAUTHORIZED);
    }
  },
);

export { MerchantAuthMiddleWare };
