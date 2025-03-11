import { Router } from "express";
import {
  HealthCheckController,
  MerchantRouter,
  UserRouter,
} from "../../controller/index.js";

const router: Router = Router();

router.use("/health", HealthCheckController);
router.use("/merchant", MerchantRouter);
router.use("/user", UserRouter);

export { router as V1Router };
