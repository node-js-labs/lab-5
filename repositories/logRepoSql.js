const db = require('../db');

exports.create = async (log, conn) => {
    const sql = 'INSERT INTO logs (user_id, action, book_title) VALUES (?, ?, ?)';
    const params = [log.user_id, log.action, log.book_title];
    await conn.execute(sql, params);
};
