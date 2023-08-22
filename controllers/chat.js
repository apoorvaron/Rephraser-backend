async function sendChat(req, res) {
  try {
    res.sendStatus(200);
  } catch (error) {
    res.status(500).sendStatus("Internal Server Error");
  }
};
async function chatHistory(req, res) {
try {
  res.sendStatus(200);
} catch (error) {
  res.status(500).send("Internal Server Error");
}
}
// Export the functions
module.exports = { sendChat, chatHistory };