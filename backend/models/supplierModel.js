const pool = require('../config/db');

const Supplier = {
    // Get all suppliers
    findAll: async () => {
        const [rows] = await pool.query('SELECT * FROM suppliers ORDER BY name ASC');
        return rows;
    },

    // Find supplier by ID
    findById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM suppliers WHERE id = ?', [id]);
        return rows[0];
    },

    // Create a new supplier
    create: async (data) => {
        const { name, email, phone, address } = data;
        const [result] = await pool.query(
            'INSERT INTO suppliers (name, email, phone, address) VALUES (?, ?, ?, ?)',
            [name, email, phone, address]
        );
        return result.insertId;
    },

    // Update an existing supplier
    update: async (id, data) => {
        const { name, email, phone, address } = data;
        const [result] = await pool.query(
            'UPDATE suppliers SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?',
            [name, email, phone, address, id]
        );
        return result.affectedRows;
    },

    // Delete a supplier
    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM suppliers WHERE id = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = Supplier;
