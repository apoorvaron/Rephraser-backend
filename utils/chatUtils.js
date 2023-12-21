const res = require('express/lib/response.js');
const DBUtils = require('../utils/dbUtils.js');

async function getCorrectsCountForToday(userId) {
    // Calculate the start and end timestamps for the current day 
    const today = new Date();
    const startOfDayTimestamp = today.toISOString().slice(0, 10) + ' 00:00:00';
    const endOfDayTimestamp = today.toISOString().slice(0, 10) + ' 23:59:59';

    // Use the dbUtils for database connection
    const dbUtils = new DBUtils();
    const checkLimitQuery = `SELECT COUNT(*) AS translation_count FROM corrections WHERE user_id = $1 AND created_at >= $2::timestamp AND created_at <= $3::timestamp; `;

    const checkLimitValues = [userId, startOfDayTimestamp, endOfDayTimestamp];

    const result = await dbUtils.run(checkLimitQuery, checkLimitValues);
    const translationCount = result.rows[0].translation_count;
    return translationCount;
}
module.exports = { getCorrectsCountForToday };