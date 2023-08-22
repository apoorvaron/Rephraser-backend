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
    res.status(200).json(dummyData);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
}
// Export the functions
module.exports = { sendChat, chatHistory };