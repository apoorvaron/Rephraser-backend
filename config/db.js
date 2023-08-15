const { Client } = require("pg");
const env = require("dotenv");
env.config();

const connectionString = process.env.DB_URL

const db = new Client({connectionString});

db.connect();

module.exports = db;
