const pool = require('../config/db');

const InventoryTransaction = {
    // Get all transactions
    findAll: async () => {
        const query = `
            SELECT t.*, p.name as product_name, p.sku as product_sku, u.username 
            FROM inventory_transactions t
            JOIN products p ON t.product_id = p.id
            JOIN users u ON t.user_id = u.id
            ORDER BY t.transaction_date DESC
        `;
        const [rows] = await pool.query(query);
        return rows;
    },

    // Record a new transaction (and update product quantity)
    recordTransaction: async (data) => {
        const { product_id, user_id, type, quantity } = data;
        
        // Start a transaction block
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Insert transaction record
            const [result] = await connection.query(
                'INSERT INTO inventory_transactions (product_id, user_id, type, quantity) VALUES (?, ?, ?, ?)',
                [product_id, user_id, type, quantity]
            );

            // 2. Update product quantity
            const quantityChange = type === 'Stock In' ? quantity : -quantity;
            await connection.query(
                'UPDATE products SET quantity = quantity + ? WHERE id = ?',
                [quantityChange, product_id]
            );

            await connection.commit();
            return result.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
};

module.exports = InventoryTransaction;
