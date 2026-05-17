const pool = require('../config/db');

const Category = {
    // Get all categories
    findAll: async () => {
        const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
        return rows;
    },

    // Find category by ID
    findById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
        return rows[0];
    },

    // Create a new category
    create: async (data) => {
        const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [data.name]);
        return result.insertId;
    },

    // Update an existing category
    update: async (id, data) => {
        const [result] = await pool.query('UPDATE categories SET name = ? WHERE id = ?', [data.name, id]);
        return result.affectedRows;
    },

    // Delete a category
    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = Category;
