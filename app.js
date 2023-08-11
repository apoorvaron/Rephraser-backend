import express from "express";
const app = express();
import bodyParser from'body-parser'; // Add body-parser

import routerDB from "./router/dbHealthCheck.js";

// Use middleware
app.use(bodyParser.json());
app.use(express.json());

import loginRoute from './routes/login.js';
app.use(loginRoute);

/** api routes */
app.use("/config", routerDB);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
