const env = require("dotenv");
env.config();
const DBUtils = require('../utils/dbUtils.js');

/** POST: http://localhost:4000/api/submitFeedback 
 * @param: {
 *   "rating" : "4",
 *   "suggestion" : "Good"
 * }
 */
async function submitFeedback(req, res) {
  const { rating, suggestion } = req.body;

  const dbUtils = new DBUtils();
  const query = 'INSERT INTO feedback (rating, suggestion) VALUES ($1, $2) RETURNING *';
  const values = [rating, suggestion];

  try {
    // Insert feedback into the database
    const result = await dbUtils.run(query, values);
    // console.log(result);
    return res.status(200).json({ message: 'Feedback submitted successfully'});
  } catch (error) {
    // console.error('Error submitting feedback:');
    return res.status(200).json({ error: 'Internal server error' });
  }
}

module.exports = { submitFeedback };
