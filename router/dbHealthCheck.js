const { Router } = require("express");
const routerDB = Router();

/** import dbHealthCheck controller */
const  { dbHealthCheck } = require("../controllers/dbHealthcheck.js");

/** GET Methods */
routerDB.route("/dbHealthcheck").get(dbHealthCheck); // dbHealthCheck

module.exports = routerDB;
