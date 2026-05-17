const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Staff and Admins can view transactions
router.get('/', protect, inventoryController.getAllTransactions);

// Staff and Admins can record transactions (Stock In / Stock Out)
router.post('/', protect, inventoryController.recordTransaction);

module.exports = router;
