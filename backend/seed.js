require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./config/db');

async function seed() {
    try {
        const salt = await bcrypt.genSalt(10);
        const adminHash = await bcrypt.hash('admin123', salt);
        const staffHash = await bcrypt.hash('staff123', salt);

        // Check if users exist
        const [rows] = await pool.query('SELECT * FROM users');
        if (rows.length === 0) {
            await pool.query('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', ['admin', adminHash, 'Admin']);
            await pool.query('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', ['staff', staffHash, 'Staff']);
            
            // Add some mock categories
            await pool.query('INSERT INTO categories (name) VALUES (?), (?), (?)', ['Electronics', 'Office Supplies', 'Furniture']);
            
            // Add some mock suppliers
            await pool.query('INSERT INTO suppliers (name, email, phone) VALUES (?, ?, ?)', ['Tech Source', 'contact@techsource.com', '123-456-7890']);
            
            console.log('Database seeded with default Admin (admin/admin123) and Staff (staff/staff123) users, plus categories and suppliers.');
        } else {
            console.log('Database already contains users. Skipping seed.');
        }
        
        await pool.end();
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

seed();
