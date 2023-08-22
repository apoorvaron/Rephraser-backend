const jwt = require('jsonwebtoken');
const DBUtils = require('../utils/dbUtils.js');
const OpenAI = require("openai");
const env = require("dotenv");
env.config();

const SYSTEM_PROMPT = "You are a helpful assistant that corrects text in English.";
const dummyData = [
  {
    "text": "This is corrected text",
    "time": "10:02 PM July 3rd, 2023",
    "sender": "bot"
  },
  {
    "text": "This is user sent text",
    "time": "10:01 PM July 3rd, 2023",
    "sender": "user"
  }
];

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function sendChat(req, res) {
  try {
    const { text } = req.body;

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

    const rephrasedText = response.choices[0].message.content;
    res.sendStatus(200);

  } catch (error) {
    console.error("Error sending chat:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function chatHistory(req, res) {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Missing token' });
    }
    jwt.verify(token, process.env.JWT_SECRET, async (error, decodedToken) => {
      if (error) {
        console.log(error);
        return res.status(403).json({ message: 'Invalid token' });
      }
      const userId = decodedToken.userId;
      // Use the dbUtils for database connection
      const dbUtils = new DBUtils();
      const query = 'SELECT * FROM corrections WHERE user_id = $1';
      const values = [userId];
      try {
        // Retrieve chat history based on the user ID
        const result = await dbUtils.run(query, values);
        const chatHistory = result.rows;
        res.status(200).json({ chatHistory });
      } catch (error) {
        console.error('Error retrieving chat history:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });
  } catch (error) {
    console.error('Error in chatHistory:', error);
    res.status(500).send('Internal Server Error');
  }
}
// Export the functions
module.exports = { sendChat, chatHistory };