async function sendChat(req, res) {
    try {
      res.sendStatus(200);
    } catch (error) {
      res.status(500).sendStatus("Internal Server Error");
    }
};
  
module.exports = { sendChat };
  
  
  