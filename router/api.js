import { Router } from "express";
const router = Router();

/** import all controllers */
import * as controllerLogin from "../controllers/login.js";

/** POST Methods */
router.route("/login").post(controllerLogin.login); // login in app

export default router;
