const DBUtils = require('../utils/dbUtils.js');
const OpenAI = require("openai");
const env = require("dotenv");
env.config();
const moment = require('moment');
const openaiUtils= require('../utils/openaiUtils.js');
const {getCorrectsCountForToday}= require('../utils/chatUtils.js');

const DAILY_TRANSACTION_LIMIT = 10000; 

async function sendChat(req, res) {
  const { text } = req.body;
  const { userId } = req;

  // Use the dbUtils for database connection
  const dbUtils = new DBUtils();

  // Check if the user has reached the daily limit
  const translationCount = await getCorrectsCountForToday(userId);

  if (translationCount >= DAILY_TRANSACTION_LIMIT) {
    return res.status(400).json({Transactions:translationCount, message: `You have exhausted your daily limit of ${DAILY_TRANSACTION_LIMIT} free translations` });
  }

  const rephrasedTextWithQuotes = await openaiUtils.getRephrasedText(text);

  // Remove quotes if present in the rephrasedTextWithQuotes
  const rephrasedText = rephrasedTextWithQuotes.replace(/^["']/, "").replace(/["']$/, "");

  // Insert the entry into the corrections table
  const insertQuery = 'INSERT INTO corrections (user_id, original_text, rephrased_text, created_at) VALUES ($1, $2, $3, NOW())';
  const insertValues = [userId, text, rephrasedText];

  await dbUtils.run(insertQuery, insertValues);
  const incrementedTranslation = (Number(translationCount)+1).toString();
  res.status(200).json({Transactions:incrementedTranslation});

}

// Function to format the time using moment.js
function formatDate(timestamp) {
  return moment(timestamp).format('h:mm A MMMM DD, YYYY');
}

// Getting chat History from DB according to user id
async function chatHistory(req, res) {
  const { userId } = req;

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
  // Check if the user has reached the daily limit
  const translationCount = await getCorrectsCountForToday(userId);

  res.status(200).json({Transactions:translationCount,History:transformedChatHistory});

}

// Export the functions
module.exports = { sendChat, chatHistory };