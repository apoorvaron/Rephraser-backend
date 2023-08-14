const { Router } = require("express");
const router = Router();

/** import all controllers */
const controllerLogin = require("../controllers/login.js");

/** POST Methods */
router.route("/login").post(controllerLogin.login); // login in app

module.exports = router;
