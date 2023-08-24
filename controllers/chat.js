const jwt = require('jsonwebtoken');
const DBUtils = require('../utils/dbUtils.js');
const OpenAI = require("openai");
const env = require("dotenv");
env.config();
const moment = require('moment');

const SYSTEM_PROMPT = "You are a helpful assistant that corrects text in English.";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function sendChat(req, res) {
  try {
    const { text } = req.body;
    const { userId } = req;    

    const response =  await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text },
      ],
      temperature: 0.7,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const rephrasedTextWithQuotes = response.choices[0].message.content;

    // Remove quotes if present in the rephrasedTextWithQuotes
    const rephrasedText = rephrasedTextWithQuotes.replace(/["']/g, "");
    
    
    // Use the dbUtils for database connection
    const dbUtils = new DBUtils();

    // Insert the entry into the corrections table
    const insertQuery = 'INSERT INTO corrections (user_id, original_text, rephrased_text, created_at) VALUES ($1, $2, $3, NOW())';
    const insertValues = [userId, text, rephrasedText];

    await dbUtils.run(insertQuery, insertValues);

    res.sendStatus(200);

  } catch (error) {
    console.error("Error sending chat:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Function to format the time using moment.js
function formatDate(timestamp) {
  return moment(timestamp).format('h:mm A MMMM DDo, YYYY');
}

// Getting chat History from DB according to user id
async function chatHistory(req, res) {

    try {
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

          transformedChatHistory.push(userMessage);
          transformedChatHistory.push(botMessage);
        }

        res.status(200).json(transformedChatHistory);
    } catch (error) {
      console.error('Error retrieving chat history:', error);
      res.status(500).json({ message: 'Internal server error' });
    }

}

// Export the functions
module.exports = { sendChat, chatHistory };