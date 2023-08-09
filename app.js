const express = require('express');

const app = express();

const dbHealthCheck = require('./config/healthcheck');

const port = process.env.PORT || 3000;

app.use(dbHealthCheck);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});