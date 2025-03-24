import express from "express";
import { confirmEmail } from "../controller/user.controller";
import { EMAIL_CONF_ENDPOINT } from "../utils/constants";
const router = express.Router();

router.get(EMAIL_CONF_ENDPOINT, confirmEmail);

export default router;