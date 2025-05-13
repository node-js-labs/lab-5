const pool = require('../db');

exports.findAll = async () => {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
};

exports.findById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
};

exports.findByUsername = async (username) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
};

exports.create = async (user) => {
    const { username, name, surname, password, role } = user;
    const [result] = await pool.query(
        'INSERT INTO users (username, name, surname, password, role) VALUES (?, ?, ?, ?, ?)',
        [username, name, surname, password, role || 'user']
    );
    return { id: result.insertId, ...user };
};

exports.update = async (id, user) => {
    const { username, name, surname, password } = user;

    if (!password) {
        await pool.query(
            'UPDATE users SET username = ?, name = ?, surname = ? WHERE id = ?',
            [username, name, surname, id]
        );
    } else {
        await pool.query(
            'UPDATE users SET username = ?, name = ?, surname = ?, password = ? WHERE id = ?',
            [username, name, surname, password, id]
        );
    }

    return this.findById(id);
};

exports.delete = async (id) => {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
};