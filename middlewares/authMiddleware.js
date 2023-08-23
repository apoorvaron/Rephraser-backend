const jwt = require('jsonwebtoken');
const env = require("dotenv");
env.config();

async function authenticateToken(req, res, next) {

  // Skip authentication for specific routes
  if (req.path === '/login' || req.path === '/register' || req.path === '/dbHealthcheck') {
    return next();
  }

  const token = req.header('Authorization').replace('Bearer ', '');

  // Check if token is present
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    
    // Verify and decode the token
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    // Set the user ID on the request object for later use
    req.userId = decodedToken.userId;

    // Continue to the next middleware
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
}

module.exports = authenticateToken;
