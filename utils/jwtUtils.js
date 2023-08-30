const jwt = require('jsonwebtoken');
require('dotenv').config();
const TOKEN_EXPIRY_TIME = '1d'; // Set token expiry time to 1 day
function generateToken(userId, username) {
    const token = jwt.sign({ userId: userId, username: username }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY_TIME });
    return token;
}
module.exports = { generateToken };