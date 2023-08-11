import express from "express";
const app = express();
import bodyParser from'body-parser'; // Add body-parser

import apiRouter from "./router/api.js";
import configRouter from "./router/dbHealthCheck.js";

// Use middleware
app.use(bodyParser.json());
app.use(express.json());


/** api routes */
app.use("/api", apiRouter);
app.use("/config", configRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
export default app;