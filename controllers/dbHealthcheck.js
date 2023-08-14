const db = require("../config/db.js");

async function dbHealthCheck(req, res) {
    console.log("Checking database health...");
    try {
        await db.query('SELECT 1');
        console.log('Database is connected');
        res.status(200).send('Database is connected');
    } catch (err) {
        console.log('Database connection error');
        res.status(500).send('Database connection error');
    }
}

module.exports = { dbHealthCheck }; // Export the function as an object property