import express from "express";
const app = express();
import bodyParser from'body-parser'; // Add body-parser

import router from "./router/api.js";
import routerDB from "./router/dbHealthCheck.js";

// Use middleware
app.use(bodyParser.json());
app.use(express.json());


/** api routes */
app.use("/api", router);
app.use("/config", routerDB);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
