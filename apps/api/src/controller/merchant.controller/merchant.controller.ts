import { Router } from "express";
import { MerchantAuthMiddleWare } from "../../middleWare";
import {
  RegisterMerchant,
  loginMerchant,
  getAssociatedAccount,
  makeAssociatedAccount,
  newMint,
} from "../../router";

const router: Router = Router();

router.route("/signup").post(RegisterMerchant);
router.route("/signin").post(loginMerchant);
router
  .route("/associatedAccount")
  .post(MerchantAuthMiddleWare, getAssociatedAccount);
router.route("/newaccount").post(MerchantAuthMiddleWare, makeAssociatedAccount);
//TODO: add admin middleWare
router.route("/newmint").post(newMint);

export { router as MerchantRouter };
