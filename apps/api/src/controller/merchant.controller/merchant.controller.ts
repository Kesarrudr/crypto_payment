import { RequestHandler, Router } from "express";
import { MerchantAuthMiddleWare } from "../../middleWare/index.js";
import {
  RegisterMerchant,
  loginMerchant,
  getAssociatedAccount,
  makeAssociatedAccount,
  merchantTranscations,
  merchantBalance,
} from "../../router/index.js";

const router: Router = Router();
const authMiddleWare = [MerchantAuthMiddleWare as RequestHandler];

router.route("/signup").post(RegisterMerchant as RequestHandler);
router.route("/signin").post(loginMerchant as RequestHandler);

router
  .route("/account")
  .get(...authMiddleWare, getAssociatedAccount as RequestHandler);

router
  .route("/newaccount")
  .post(...authMiddleWare, makeAssociatedAccount as RequestHandler);

router
  .route("/transaction")
  .get(...authMiddleWare, merchantTranscations as RequestHandler);

router
  .route("/balance")
  .get(...authMiddleWare, merchantBalance as RequestHandler);

export { router as MerchantRouter };
