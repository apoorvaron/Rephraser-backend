const { Client } = require("pg");
const env = require("dotenv");
env.config();

const connectionString = process.env.DB_URL;

class DBUtils {
  constructor() {
    this.client = new Client({ connectionString });
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.end();
  }

  async run(query, values) {
    try {
      await this.connect();
      const result = await this.client.query(query, values);
      return result;
    } catch (error) {
      throw error;
    } finally {
      await this.disconnect();
    }
  }
}

module.exports = DBUtils;
