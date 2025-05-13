const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'library_app'
});

module.exports = pool;

async function testConnection() {
    try {
        await pool.getConnection();
        console.log("Підключення до БД успішне!");
    } catch (error) {
        console.error("Помилка з’єднання з БД", error);
    }
}

testConnection();
