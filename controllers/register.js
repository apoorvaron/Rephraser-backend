const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db.js');
const { generateToken } = require('../utils/jwtUtils'); // Update the path accordingly
require('dotenv').config();
const TOKEN_EXPIRY_TIME = '1d'; // Set token expiry time to 1 day
async function register(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Missing Credentials' });
        }
        const userCheckResult = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userCheckResult.rows.length > 0) {
            return res.status(400).json({ message: 'Username already registered' });
        }
        const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!passwordPattern.test(password)) {
            return res.status(400).json({ message: 'Password is not strong enough' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertionResult = await db.query(
            'INSERT INTO users (username, password, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id',
            [username, hashedPassword]
        );
        if (insertionResult.rows.length > 0) {
            // Generate token using the utility function
            const userId = insertionResult.rows[0].id;
            const token = generateToken(userId);
            return res.status(200).json({ message: 'Registration Successful', token: token });
        } else {
            return res.status(500).json({ message: 'Failed to register user' });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports = { register };