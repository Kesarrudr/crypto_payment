import { Request, Response } from "express";
import {
  asyncHandler,
  sendRespnse,
  StatusCode,
  StatusEnum,
} from "../../utilis";
import { AppError } from "../../utilis/funtions/AppError";

const HealthCheckHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    let isHealthy: Boolean = true;

    if (!isHealthy) {
      throw new AppError("Server is Not Fine ❌ ", StatusCode.ServerDownError);
    }

    sendRespnse(res, StatusCode.ok, StatusEnum.success, "Everything is Good👍");
  },
);

export { HealthCheckHandler };
