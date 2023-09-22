const { Client } = require("pg");
const env = require("dotenv");
env.config();

const connectionString = process.env.NODE_ENV === "test" ? process.env.TEST_DB_URL : process.env.DB_URL;


class DBUtils {

    async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.end();
  }

  async run(query, values) {
    try {
      this.client = new Client({connectionString});

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
