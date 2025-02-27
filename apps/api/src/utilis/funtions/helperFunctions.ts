import { Response } from "express";

enum StatusEnum {
  success = "success",
  error = "error",
}

enum StatusCode {
  ok = 200,
  error = 500,
  missingBody = 400,
  InvlaidBody = 401,
  ServerDownError = 503,
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

export { sendRespnse, StatusEnum, StatusCode };
