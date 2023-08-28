const express = require("express") ;
const cors = require('cors');

const bodyParser = require('body-parser'); // Add body-parser

const apiRouter = require("./router/api.js");
const configRouter = require("./router/dbHealthCheck.js");
const authenticateToken = require("./middlewares/authMiddleware.js");
const errorMiddleware = require("./middlewares/errorMiddleware.js");

const app = express();

// Use middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// Use the authenticateToken middleware for all routes
app.use(authenticateToken);

/** api routes */
app.use("/api", apiRouter);
app.use("/config", configRouter);

// Add the error middleware
app.use(errorMiddleware);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// for unit test
module.exports = app ;
