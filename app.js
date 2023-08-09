const app = require('./config/express'); // Import your Express app configuration
const db = require('./config/db'); // Import your database connection

// Define the port number
const port = process.env.PORT || 3000;

// Connect to the database
db.connect()
  .then(() => {
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });