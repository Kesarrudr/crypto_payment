import { RequestHandler, Router } from "express";
import { HealthCheckHandler } from "../../router";

const router: Router = Router();

router.route("/").get(HealthCheckHandler as RequestHandler);

export { router as HealthCheckController };
