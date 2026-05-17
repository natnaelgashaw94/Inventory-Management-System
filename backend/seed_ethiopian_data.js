require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./config/db');

// Realistic Ethiopian Data
const categoriesData = [
  'Electronics', 'Office Supplies', 'Furniture', 'Groceries', 'Appliances', 'IT Equipment', 'Building Materials'
];

const suppliersData = [
  { name: 'Addis Tech PLC', email: 'info@addistech.com.et', phone: '0911234567', address: 'Bole Sub-city, Addis Ababa' },
  { name: 'Abyssinia Electronics', email: 'sales@abyssiniaelec.com', phone: '0912345678', address: 'Merkato, Addis Ababa' },
  { name: 'Sheba Office Supplies', email: 'contact@shebaoffice.com', phone: '0913456789', address: 'Piassa, Addis Ababa' },
  { name: 'Rift Valley Furniture', email: 'hello@riftvalleyfurn.com', phone: '0914567890', address: 'Hawassa, Sidama' },
  { name: 'Lucy Trade & Logistics', email: 'supply@lucytrade.com', phone: '0915678901', address: 'Adama, Oromia' },
  { name: 'Blue Nile Distributors', email: 'admin@blueniledist.com', phone: '0916789012', address: 'Bahir Dar, Amhara' },
  { name: 'Merkato Imports', email: 'import@merkato.com.et', phone: '0917890123', address: 'Merkato, Addis Ababa' },
  { name: 'Bole Enterprises', email: 'bole@enterprises.com', phone: '0918901234', address: 'Bole, Addis Ababa' }
];

const usersData = [
  { username: 'abebe_t', role: 'Staff' }, { username: 'kebede_m', role: 'Staff' },
  { username: 'alemu_h', role: 'Staff' }, { username: 'bekele_w', role: 'Staff' },
  { username: 'chala_a', role: 'Staff' }, { username: 'dawit_g', role: 'Admin' },
  { username: 'elias_b', role: 'Staff' }, { username: 'fikre_d', role: 'Staff' },
  { username: 'girma_t', role: 'Staff' }, { username: 'hailu_m', role: 'Staff' },
  { username: 'ibrahim_k', role: 'Staff' }, { username: 'jamal_s', role: 'Staff' },
  { username: 'kassahun_y', role: 'Staff' }, { username: 'lemma_z', role: 'Staff' },
  { username: 'mamo_t', role: 'Staff' }, { username: 'negash_m', role: 'Staff' },
  { username: 'oumer_a', role: 'Staff' }, { username: 'petros_w', role: 'Staff' },
  { username: 'solomon_g', role: 'Staff' }, { username: 'tesfaye_b', role: 'Admin' }
];

const productsTemplate = [
  { cat: 'Electronics', sup: 'Addis Tech PLC', items: [
    { name: 'Samsung Galaxy S23', pp: 45000, sp: 52000, desc: 'Latest Samsung flagship phone' },
    { name: 'iPhone 14 Pro', pp: 65000, sp: 75000, desc: 'Apple iPhone 14 Pro 256GB' },
    { name: 'Tecno Spark 10', pp: 8000, sp: 10000, desc: 'Budget friendly smartphone' },
    { name: 'Infinix Hot 30', pp: 9000, sp: 11000, desc: 'Infinix Hot 30 with 8GB RAM' }
  ]},
  { cat: 'IT Equipment', sup: 'Abyssinia Electronics', items: [
    { name: 'HP Envy Laptop', pp: 40000, sp: 48000, desc: 'HP Envy 13 inch, Intel i7' },
    { name: 'Dell XPS 13', pp: 60000, sp: 70000, desc: 'Dell XPS 13 inch ultrabook' },
    { name: 'MacBook Air M2', pp: 80000, sp: 95000, desc: 'Apple MacBook Air with M2 chip' },
    { name: 'Lenovo ThinkPad X1', pp: 70000, sp: 82000, desc: 'Lenovo ThinkPad X1 Carbon' }
  ]},
  { cat: 'Office Supplies', sup: 'Sheba Office Supplies', items: [
    { name: 'A4 Copy Paper Box', pp: 1500, sp: 2000, desc: 'Box of 5 reams of A4 paper' },
    { name: 'Bic Pens (Pack of 50)', pp: 500, sp: 750, desc: 'Blue Bic pens pack' },
    { name: 'Stapler Heavy Duty', pp: 800, sp: 1200, desc: 'Heavy duty stapler for office use' },
    { name: 'Whiteboard 120x90cm', pp: 2500, sp: 3500, desc: 'Magnetic whiteboard' },
    { name: 'Sticky Notes (10 Pack)', pp: 200, sp: 350, desc: 'Yellow sticky notes' }
  ]},
  { cat: 'Furniture', sup: 'Rift Valley Furniture', items: [
    { name: 'Office Desk Organizer', pp: 300, sp: 500, desc: 'Wooden desk organizer' },
    { name: 'Filing Cabinet', pp: 8000, sp: 10500, desc: '4-drawer metal filing cabinet' },
    { name: 'Office Chair Ergonomic', pp: 4500, sp: 6000, desc: 'Ergonomic mesh office chair' },
    { name: 'Conference Table', pp: 15000, sp: 20000, desc: '8-seater wooden conference table' },
    { name: 'Teffera Sofa Set', pp: 35000, sp: 45000, desc: 'Living room L-shape sofa' },
    { name: 'Wardrobe 3-Door', pp: 12000, sp: 16000, desc: 'Wooden 3-door wardrobe' }
  ]},
  { cat: 'Groceries', sup: 'Merkato Imports', items: [
    { name: 'Teff (100kg Magna)', pp: 8000, sp: 9500, desc: 'White Magna Teff from Adaa' },
    { name: 'Shiro Powder (5kg)', pp: 1000, sp: 1300, desc: 'Spiced Shiro powder' },
    { name: 'Berbere (5kg)', pp: 1500, sp: 2000, desc: 'Traditional Ethiopian Berbere' },
    { name: 'Edible Oil (5L)', pp: 800, sp: 1000, desc: 'Sunflower edible oil 5 liters' },
    { name: 'Sugar (50kg)', pp: 4000, sp: 4800, desc: 'White sugar 50kg sack' }
  ]},
  { cat: 'Appliances', sup: 'Bole Enterprises', items: [
    { name: 'Beko Refrigerator', pp: 35000, sp: 42000, desc: 'Beko Double door fridge' },
    { name: 'LG Washing Machine', pp: 28000, sp: 34000, desc: 'LG Front load 8kg' },
    { name: 'Samsung Microwave', pp: 5000, sp: 6500, desc: 'Samsung 23L Microwave oven' },
    { name: 'Hisense TV 55"', pp: 25000, sp: 30000, desc: 'Hisense 55 inch Smart 4K TV' },
    { name: 'Philips Iron', pp: 1500, sp: 2200, desc: 'Philips dry iron' }
  ]}
];

// Helper to get a random date in the past
function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedEthiopianData() {
    let connection;
    try {
        connection = await pool.getConnection();
        console.log('Connected to the database. Starting seed process...');

        // Disable foreign key checks for truncation
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        // Truncate tables
        await connection.query('TRUNCATE TABLE inventory_transactions');
        await connection.query('TRUNCATE TABLE products');
        await connection.query('TRUNCATE TABLE categories');
        await connection.query('TRUNCATE TABLE suppliers');
        // Do not truncate users to keep the admin/admin123, just delete the non-default ones
        await connection.query(`DELETE FROM users WHERE username NOT IN ('admin', 'staff')`);

        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('Tables cleared.');

        // Insert Categories
        const catMap = {};
        for (const catName of categoriesData) {
            const [result] = await connection.query('INSERT INTO categories (name) VALUES (?)', [catName]);
            catMap[catName] = result.insertId;
        }
        console.log('Categories inserted.');

        // Insert Suppliers
        const supMap = {};
        for (const sup of suppliersData) {
            const [result] = await connection.query('INSERT INTO suppliers (name, email, phone, address) VALUES (?, ?, ?, ?)', [sup.name, sup.email, sup.phone, sup.address]);
            supMap[sup.name] = result.insertId;
        }
        console.log('Suppliers inserted.');

        // Insert Users
        const salt = await bcrypt.genSalt(10);
        const defaultPassword = await bcrypt.hash('password123', salt);
        const userIds = [];
        
        // Fetch existing users (admin, staff) to include in transactions
        const [existingUsers] = await connection.query('SELECT id FROM users');
        existingUsers.forEach(u => userIds.push(u.id));

        for (const u of usersData) {
            const [result] = await connection.query('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', [u.username, defaultPassword, u.role]);
            userIds.push(result.insertId);
        }
        console.log('Users inserted.');

        // Insert Products
        const productIds = [];
        let skuCounter = 1000;
        for (const group of productsTemplate) {
            const category_id = catMap[group.cat];
            const supplier_id = supMap[group.sup];

            for (const item of group.items) {
                const sku = `SKU-${skuCounter++}`;
                const barcode = `BAR-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
                // Random stock between 0 and 150
                const quantity = Math.floor(Math.random() * 150);
                const minimum_stock = Math.floor(Math.random() * 20) + 5;
                
                const [result] = await connection.query(
                    'INSERT INTO products (name, sku, barcode, quantity, minimum_stock, purchase_price, selling_price, category_id, supplier_id, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [item.name, sku, barcode, quantity, minimum_stock, item.pp, item.sp, category_id, supplier_id, item.desc]
                );
                productIds.push(result.insertId);
            }
        }
        console.log('Products inserted.');

        // Insert Inventory Transactions (Historical records)
        // Generate about 100 transactions
        const numTransactions = 100;
        const now = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 6);

        for (let i = 0; i < numTransactions; i++) {
            const product_id = productIds[Math.floor(Math.random() * productIds.length)];
            const user_id = userIds[Math.floor(Math.random() * userIds.length)];
            const type = Math.random() > 0.4 ? 'Stock Out' : 'Stock In'; // 60% out, 40% in
            const quantity = Math.floor(Math.random() * 20) + 1;
            const transaction_date = getRandomDate(sixMonthsAgo, now);

            // Format date for MySQL: YYYY-MM-DD HH:MM:SS
            const formattedDate = transaction_date.toISOString().slice(0, 19).replace('T', ' ');

            await connection.query(
                'INSERT INTO inventory_transactions (product_id, user_id, type, quantity, transaction_date) VALUES (?, ?, ?, ?, ?)',
                [product_id, user_id, type, quantity, formattedDate]
            );
        }
        console.log('Inventory transactions inserted.');

        console.log('✅ Realistic Ethiopian data seeding completed successfully!');
        
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        if (connection) connection.release();
        pool.end();
    }
}

seedEthiopianData();
