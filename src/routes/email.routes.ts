import express from "express";
import { confirmEmail } from "../controller/user.controller";
const router = express.Router();

router.get(`/confirm/:key`, confirmEmail);

export default router;
