const app = require('./config/express'); // Import your Express app configuration

// Define the port number
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});