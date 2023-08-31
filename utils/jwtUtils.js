const jwt = require('jsonwebtoken');
require('dotenv').config();
const TOKEN_EXPIRY_TIME = '1d'; // Set token expiry time to 1 day
function generateToken(userId, email) {
    const token = jwt.sign({ userId: userId, email: email }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY_TIME });
    return token;
}
module.exports = { generateToken };