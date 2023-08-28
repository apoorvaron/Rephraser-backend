const DBUtils = require('../utils/dbUtils.js');
const OpenAI = require("openai");
const env = require("dotenv");
env.config();
const moment = require('moment');
const openaiUtils= require('../utils/openaiUtils.js');


async function sendChat(req, res) {

  const { text } = req.body;
  const { userId } = req;

  try {
    const rephrasedTextWithQuotes = await openaiUtils.getRephrasedText(text);

    // Remove quotes if present in the rephrasedTextWithQuotes
    const rephrasedText = rephrasedTextWithQuotes.replace(/^["']/, "").replace(/["']$/, "");


    // Use the dbUtils for database connection
    const dbUtils = new DBUtils();

    // Insert the entry into the corrections table
    const insertQuery = 'INSERT INTO corrections (user_id, original_text, rephrased_text, created_at) VALUES ($1, $2, $3, NOW())';
    const insertValues = [userId, text, rephrasedText];

    await dbUtils.run(insertQuery, insertValues);

    res.sendStatus(200);

  } catch (error) {
    throw(error);
  }
}

// Function to format the time using moment.js
function formatDate(timestamp) {
  return moment(timestamp).format('h:mm A MMMM DD, YYYY');
}

// Getting chat History from DB according to user id
async function chatHistory(req, res) {
  const { userId } = req;

  try {


      // Use the dbUtils for database connection
    const dbUtils = new DBUtils();
    const query = 'SELECT * FROM corrections WHERE user_id = $1 ORDER BY created_at DESC';
    const values = [userId];


        // Retrieve chat history based on the user ID
    const result = await dbUtils.run(query, values);
    const chatHistory = result.rows;

            // Transform chat history into desired response format
    const transformedChatHistory = [];

    for (const entry of chatHistory) {
      const userMessage = {
        text: entry.original_text, // Text from the original_text field
        time: formatDate(entry.created_at),
        sender: 'user',
      };

      const botMessage = {
        text: entry.rephrased_text, // Text from the rephrased_text field
        time: formatDate(entry.created_at),
        sender: 'bot',
      };

      transformedChatHistory.push(botMessage);
      transformedChatHistory.push(userMessage);

    }

    res.status(200).json(transformedChatHistory);
  } catch (error) {
    throw(error);
  }

}

// Export the functions
module.exports = { sendChat, chatHistory };