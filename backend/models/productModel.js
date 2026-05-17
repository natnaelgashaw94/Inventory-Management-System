const pool = require('../config/db');

const Product = {
    // Get all products with category and supplier details
    findAll: async () => {
        const query = `
            SELECT p.*, c.name as category_name, s.name as supplier_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            ORDER BY p.created_at DESC
        `;
        const [rows] = await pool.query(query);
        return rows;
    },

    // Find product by ID
    findById: async (id) => {
        const query = `
            SELECT p.*, c.name as category_name, s.name as supplier_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            WHERE p.id = ?
        `;
        const [rows] = await pool.query(query, [id]);
        return rows[0];
    },

    // Create a new product
    create: async (data) => {
        const { 
            name, sku, barcode, quantity, minimum_stock, purchase_price, 
            selling_price, category_id, supplier_id, image_url, description 
        } = data;
        
        const [result] = await pool.query(
            `INSERT INTO products 
            (name, sku, barcode, quantity, minimum_stock, purchase_price, selling_price, category_id, supplier_id, image_url, description) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, sku || null, barcode || null, quantity || 0, minimum_stock || 5, purchase_price, selling_price, category_id || null, supplier_id || null, image_url || null, description || null]
        );
        return result.insertId;
    },

    // Update an existing product
    update: async (id, data) => {
        const { 
            name, sku, barcode, quantity, minimum_stock, purchase_price, 
            selling_price, category_id, supplier_id, image_url, description 
        } = data;

        let query = `UPDATE products SET 
            name = ?, sku = ?, barcode = ?, quantity = ?, minimum_stock = ?, 
            purchase_price = ?, selling_price = ?, category_id = ?, 
            supplier_id = ?, description = ?`;
        
        const queryParams = [name, sku || null, barcode || null, quantity, minimum_stock, purchase_price, selling_price, category_id || null, supplier_id || null, description || null];

        // Only update image_url if a new one is provided (so we don't overwrite existing image with null if no new file is uploaded)
        if (image_url !== undefined) {
            query += `, image_url = ?`;
            queryParams.push(image_url);
        }

        query += ` WHERE id = ?`;
        queryParams.push(id);

        const [result] = await pool.query(query, queryParams);
        return result.affectedRows;
    },

    // Delete a product
    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
        return result.affectedRows;
    },
    
    // Update product quantity (used by inventory transactions)
    updateQuantity: async (id, quantityChange, connection = null) => {
        const db = connection || pool;
        const [result] = await db.query(
            'UPDATE products SET quantity = quantity + ? WHERE id = ?',
            [quantityChange, id]
        );
        return result.affectedRows;
    }
};

module.exports = Product;
