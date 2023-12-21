const { Router } = require("express");
const router = Router();

/** import all controllers */
const controllerLogin = require("../controllers/login.js");
const controllerRegister = require("../controllers/register.js");
const controllerChat = require("../controllers/chat.js"); 
const controllerGoogleLogin = require('../controllers/googleLogin.js');
const controllerSubmitFeedback = require('../controllers/submitFeedback.js');

/** POST Methods */
router.route("/login").post(controllerLogin.login); // login in app
router.route("/register").post(controllerRegister.register); // registration in app
router.route("/chat").post(controllerChat.sendChat);
router.route('/google_login').post(controllerGoogleLogin.googleLogin);
router.route('/submitFeedback').post(controllerSubmitFeedback.submitFeedback);

/** GET Methods */
router.route("/chat").get(controllerChat.chatHistory);

module.exports = router;
