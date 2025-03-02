import cors from "cors";
import express, { Express } from "express";
import { ErrorHandler } from "./utilis";
import { V1Router } from "./version";

//TODO: add the return types fo the server response also
const createServer = (): Express => {
  const app = express();

  app.use(express.json());

  app.use(cors());

  app.use("/api/v1", V1Router);

  app.use(ErrorHandler);
  return app;
};

export { createServer };
