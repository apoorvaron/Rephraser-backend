function countTransactionsQuery() {
    const query = `SELECT COUNT(*) AS translation_count FROM corrections WHERE user_id = $1 AND created_at >= $2::timestamp AND created_at <= $3::timestamp; `;
    return query;
}
module.exports = { countTransactionsQuery };