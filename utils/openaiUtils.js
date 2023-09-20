// utils/openaiUtils.js
const { OpenAI } = require("openai");
const SYSTEM_PROMPT = "If someone asks a question like write something or tell or ask or suggest or writes appreciation/Compliment statement or give commands you to write something either in any type of language or in whatsapp language, just convert the question in correct grammatical english and if the given statement is already in correct grammatical english then do not change the statement. In case someone asks you to convert a statement in any language then convert the statement into english only and remove the language name.";

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
    temperature: 0.2,
    max_tokens: 100,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  return response.choices[0].message.content;
}

module.exports = { getRephrasedText };
