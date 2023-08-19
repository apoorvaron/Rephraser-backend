const DBUtils = require('../utils/dbUtils.js'); // Import the DBUtils module

async function dbHealthCheck(req, res) {
    console.log("Checking database health...");
    const dbUtils = new DBUtils(); 

    try {
        // Connect to the database using DBUtils
        await dbUtils.run('SELECT 1'); 
        console.log('Database is connected');
        res.status(200).send('Database is connected');
    } catch (err) {
        console.log('Database connection error');
        res.status(500).send('Database connection error');
    } 
}

module.exports = { dbHealthCheck }; 
