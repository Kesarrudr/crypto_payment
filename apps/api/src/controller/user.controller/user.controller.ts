import { Router } from "express";
import { getMerchantUserName, getTokenDetails } from "../../router";

const router: Router = Router();

router.route("/getmerchant").get(getMerchantUserName);
router.route("/getToken").get(getTokenDetails);

export { router as UserRouter };
