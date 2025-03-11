import { Response } from "express";
import {
  AppError,
  asyncHandler,
  CustomRequest,
  sendRespnse,
  StatusCode,
  StatusEnum,
} from "../../utilis/index.js";

const HealthCheckHandler = asyncHandler(
  async (_req: CustomRequest, res: Response) => {
    let isHealthy: Boolean = true;

    if (!isHealthy) {
      throw new AppError(
        "Server is Not Fine ❌ ",
        StatusCode.SERVICE_UNAVAILABLE,
      );
    }

    sendRespnse(res, StatusCode.OK, StatusEnum.success, "Everything is Good👍");
  },
);

export { HealthCheckHandler };
