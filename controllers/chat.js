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


async function sendChat(req, res) {
  try {
    res.sendStatus(200);
  } catch (error) {
    res.status(500).sendStatus("Internal Server Error");
  }
};
async function chatHistory(req, res) {
try {
  res.status(200).json(dummyData);
} catch (error) {
  res.status(500).send("Internal Server Error");
}
}
// Export the functions
module.exports = { sendChat, chatHistory };