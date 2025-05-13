const pool = require('../db');

exports.findAll = async () => {
    const [rows] = await pool.query('SELECT * FROM books');
    return rows;
};

exports.findById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
    return rows[0];
};

const logRepo = require('./logRepoSql'); // створити або підключити

exports.create = async (book, userId) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { title, author, keywords } = book;
        const [result] = await connection.query(
            'INSERT INTO books (title, author, keywords) VALUES (?, ?, ?)',
            [title, author, keywords]
        );

        const bookId = result.insertId;

        await connection.query(
            'INSERT INTO logs (user_id, action, book_title) VALUES (?, ?, ?)',
            [userId, 'create_book', title]
        );

        await connection.commit();
        return { id: bookId, ...book };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};


exports.update = async (id, book) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { title, author, keywords } = book;
        await connection.query(
            'UPDATE books SET title = ?, author = ?, keywords = ? WHERE id = ?',
            [title, author, keywords, id]
        );

        await connection.commit();
        return this.findById(id);
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

exports.delete = async (id) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        await connection.query('DELETE FROM books WHERE id = ?', [id]);

        await connection.commit();
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

exports.searchBooks = async (query) => {
    const sql = 'SELECT * FROM books WHERE title LIKE ? OR author LIKE ? OR keywords LIKE ?';
    const [rows] = await pool.execute(sql, [`%${query}%`, `%${query}%`, `%${query}%`]);
    return rows;
};
