const jwt = require('jsonwebtoken');
const DBUtils = require('../utils/dbUtils.js');
const OpenAI = require("openai");
const env = require("dotenv");
env.config();

const SYSTEM_PROMPT = "You are a helpful assistant that corrects text in English.";


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

// Function to format the time
function formatDate(timestamp) {
  const date = new Date(timestamp);

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

  const monthNames = [
    'January', 'February', 'March',
    'April', 'May', 'June',
    'July', 'August', 'September',
    'October', 'November', 'December'
  ];

  const monthIndex = date.getMonth();
  const monthName = monthNames[monthIndex];
  
  const day = date.getDate();
  let daySuffix = 'th';

  if (day === 1 || day === 21 || day === 31) {
    daySuffix = 'st';
  } else if (day === 2 || day === 22) {
    daySuffix = 'nd';
  } else if (day === 3 || day === 23) {
    daySuffix = 'rd';
  }

  return `${formattedHours}:${formattedMinutes} ${ampm} ${monthName} ${day}${daySuffix}, ${date.getFullYear()}`;
}

// Getting chat History from DB according to user id
async function chatHistory(req, res) {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');

    try {
      const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;

      // Use the dbUtils for database connection
      const dbUtils = new DBUtils();
      const query = 'SELECT * FROM corrections WHERE user_id = $1';
      const values = [userId];

      try {
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
    } catch (error) {
      console.error(error);
      return res.status(403).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Error in chatHistory:', error);
    res.status(500).send('Internal Server Error');
  }
}

// Export the functions
module.exports = { sendChat, chatHistory };