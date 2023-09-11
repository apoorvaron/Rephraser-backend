const { Client } = require("pg");
const env = require("dotenv");
env.config();

const DB_NAME = process.env.NODE_ENV === "test" ? process.env.POSTGRES_TEST_DB : process.env.POSTGRES_DB;

class DBUtils {

    async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.end();
  }

  async run(query, values) {
    try {
      this.client = new Client({
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        host: process.env.POSTGRES_HOST,
        database: DB_NAME
      });
      
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
