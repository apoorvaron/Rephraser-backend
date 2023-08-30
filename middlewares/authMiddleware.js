const jwt = require('jsonwebtoken');
const env = require("dotenv");
env.config();

// List of paths to skip authentication for
const pathsToSkipAuth = ['/api/login', '/api/register', '/config/dbHealthcheck'];

async function authenticateToken(req, res, next) {

  // Skip authentication for specific paths
  if (pathsToSkipAuth.includes(req.path)) {
    return next();
  }

  const token = req.header('Authorization');

  // Check if token is present
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    
    // Verify and decode the token
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    // Set the user ID on the request object for later use
    req.userId = decodedToken.userId;

    // Set the username on the request object for later use
    req.username = decodedToken.username;
    
    // Continue to the next middleware
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
}

module.exports = authenticateToken;
