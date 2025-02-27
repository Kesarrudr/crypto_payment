import { Router } from "express";
import { HealthCheckHandler } from "../../router";

const router: Router = Router();

router.route("/").get(HealthCheckHandler);

export { router as HealthCheckController };
