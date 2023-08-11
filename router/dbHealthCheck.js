import { Router } from "express";
const routerDB = Router();

/** import dbHealthCheck controller */
import  { dbHealthCheck } from "../controllers/dbHealthcheck.js";

/** GET Methods */
routerDB.route("/dbHealthcheck").get(dbHealthCheck); // dbHealthCheck

export default routerDB;
