const pool = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        const [productCount] = await pool.query('SELECT COUNT(*) as count FROM products');
        const [categoryCount] = await pool.query('SELECT COUNT(*) as count FROM categories');
        const [supplierCount] = await pool.query('SELECT COUNT(*) as count FROM suppliers');
        const [userCount] = await pool.query('SELECT COUNT(*) as count FROM users');
        
        // Products where quantity is less than minimum_stock
        const [lowStockItems] = await pool.query('SELECT * FROM products WHERE quantity < minimum_stock');
        
        // Inventory Overview for Chart (Top 10 highest stock items)
        const [inventoryOverview] = await pool.query('SELECT name, quantity FROM products ORDER BY quantity DESC LIMIT 10');
        
        // Recent transactions
        const [recentTransactions] = await pool.query(`
            SELECT t.*, p.name as product_name, u.username 
            FROM inventory_transactions t
            JOIN products p ON t.product_id = p.id
            JOIN users u ON t.user_id = u.id
            ORDER BY t.transaction_date DESC
            LIMIT 10
        `);

        res.json({
            stats: {
                totalProducts: productCount[0].count,
                totalCategories: categoryCount[0].count,
                totalSuppliers: supplierCount[0].count,
                totalUsers: userCount[0].count,
            },
            inventoryOverview,
            lowStockAlerts: lowStockItems,
            recentActivity: recentTransactions
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server error fetching dashboard stats' });
    }
};
