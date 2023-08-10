const express = require('express');
const app = express();
const bodyParser = require('body-parser'); // Add body-parser

app.use(bodyParser.json()); // Use body-parser middleware

// Import and use the login route
const loginRoute = require('./routes/login');
app.use(loginRoute);


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
