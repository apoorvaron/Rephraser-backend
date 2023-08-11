import express from 'express';
const app = express();
import bodyParser from 'body-parser'; // Add body-parser

app.use(bodyParser.json()); // Use body-parser middleware

// Import and use the login route
import loginRoute from './routes/login.js';
app.use(loginRoute);

import dbHealthCheck from './config/healthcheck.js';
app.use(dbHealthCheck);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
