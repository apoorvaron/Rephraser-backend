// utils/openaiUtils.js
const { OpenAI } = require("openai");
const SYSTEM_PROMPT = "You are a helpful assistant that corrects text in English.";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getRephrasedText(userInput) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userInput },
    ],
    temperature: 0.7,
    max_tokens: 100,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  return response.choices[0].message.content;
}

module.exports = { getRephrasedText };
