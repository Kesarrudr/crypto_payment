import { Router } from "express";
import { HealthCheckController } from "../../controller";

const router: Router = Router();

router.use("/health", HealthCheckController);

export { router as V1Router };
