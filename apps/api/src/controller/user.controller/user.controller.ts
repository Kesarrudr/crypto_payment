import { Router } from "express";
import { getMerchantUserName } from "../../router";

const router: Router = Router();

router.route("/getUsername").get(getMerchantUserName);

export { router as UserRouter };
