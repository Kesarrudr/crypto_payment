import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { sendRespnse } from "./helperFunctions";
import { StatusEnum } from "./zod";

class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean; //TRUE: when error is not user generted but due to some backend issue

  constructor(
    message: string,
    statusCode: number,
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

const ErrorHandler: ErrorRequestHandler = (
  error: AppError,
  _res: Request,
  res: Response,
  _next: NextFunction,
) => {
  //TODO: add a better Error logger
  console.log(error); //use Better error logger

  const message =
    error.isOperational && error.message
      ? error.message
      : "Internet Server Error";

  sendRespnse(res, error.statusCode, StatusEnum.error, message);
};

export { ErrorHandler, AppError };
