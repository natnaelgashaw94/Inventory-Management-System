require('dotenv').config();
const pool = require('./config/db');

async function checkUsers() {
    try {
        const [rows] = await pool.query('SELECT id, username, role, password_hash FROM users');
        console.log("USERS IN DB:", rows);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkUsers();
