const { Router } = require("express");
const router = Router();

/** import all controllers */
const controllerLogin = require("../controllers/login.js");
const controllerRegister = require("../controllers/register.js");

/** POST Methods */
router.route("/login").post(controllerLogin.login); // login in app
router.route("/register").post(controllerRegister.register); // login in app

module.exports = router;
