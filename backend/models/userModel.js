const pool = require('../config/db');

const User = {
    // Find user by username
    findByUsername: async (username) => {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    },

    // Create a new user
    create: async (userData) => {
        const { username, passwordHash, role } = userData;
        const [result] = await pool.query(
            'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
            [username, passwordHash, role || 'Staff']
        );
        return result.insertId;
    },

    // Get all users
    findAll: async () => {
        const [rows] = await pool.query('SELECT id, username, role, created_at FROM users');
        return rows;
    }
};

module.exports = User;
