import { RequestHandler, Router } from "express";
import {
  getMerchantUserName,
  getTokenDetails,
  payerTransaction,
} from "../../router/index.js";

const router: Router = Router();

router.route("/merchant").get(getMerchantUserName as RequestHandler);
router.route("/token").get(getTokenDetails as RequestHandler);
router.route("/tx").post(payerTransaction as RequestHandler);

export { router as UserRouter };
