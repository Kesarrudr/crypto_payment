import { NextFunction, Request, RequestHandler, Response } from "express";

const asyncHandler = (reqHandler: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(reqHandler(req, res, next)).catch((error) => {
      next(error);
    });
  };
};

export { asyncHandler };
