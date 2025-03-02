import { NextFunction, Request, Response } from "express";
import { AppError, asyncHandler, StatusCode } from "../../utilis";

import jwt, { Secret } from "jsonwebtoken";

const MerchantAuthMiddleWare = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authorization Header Missing", StatusCode.NOT_FOUND);
    }
    const token = authHeader.split(" ")[1];

    //TODO: can make this more secure
    try {
      jwt.verify(token, process.env.JWTSECRET || ("JWTSECRET" as Secret));
      next();
    } catch (error) {
      throw new AppError("UNAUTHORIZED", StatusCode.UNAUTHORIZED);
    }
  },
);

export { MerchantAuthMiddleWare };
