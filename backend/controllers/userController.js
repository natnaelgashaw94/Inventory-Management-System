const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error fetching users' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUserId = await User.create({ username, passwordHash, role });
        res.status(201).json({ message: 'User created successfully', id: newUserId });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error creating user' });
    }
};

// Update user role
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const userId = req.params.id;

        if (!role || (role !== 'Admin' && role !== 'Staff')) {
            return res.status(400).json({ message: 'Valid role is required (Admin or Staff)' });
        }

        // Prevent admin from downgrading their own role accidentally
        if (req.user.id === parseInt(userId) && role === 'Staff') {
            return res.status(400).json({ message: 'You cannot downgrade your own role' });
        }

        const pool = require('../config/db');
        const [result] = await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, userId]);

        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User role updated successfully' });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Server error updating user role' });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (req.user.id === parseInt(userId)) {
            return res.status(400).json({ message: 'You cannot delete yourself' });
        }

        const pool = require('../config/db');
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [userId]);

        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error deleting user' });
    }
};
