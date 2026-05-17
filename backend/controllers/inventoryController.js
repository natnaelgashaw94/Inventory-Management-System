const InventoryTransaction = require('../models/inventoryModel');
const Product = require('../models/productModel');

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await InventoryTransaction.findAll();
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Server error fetching transactions' });
    }
};

exports.recordTransaction = async (req, res) => {
    try {
        const { product_id, type, quantity } = req.body;
        const user_id = req.user.id; // From authMiddleware

        if (!product_id || !type || !quantity) {
            return res.status(400).json({ message: 'Product ID, type, and quantity are required' });
        }

        if (type !== 'Stock In' && type !== 'Stock Out') {
            return res.status(400).json({ message: 'Type must be "Stock In" or "Stock Out"' });
        }

        const parsedQuantity = parseInt(quantity);
        if (parsedQuantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be greater than zero' });
        }

        // For "Stock Out", check if there is enough inventory
        if (type === 'Stock Out') {
            const product = await Product.findById(product_id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            if (product.quantity < parsedQuantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock. Current quantity: ${product.quantity}` 
                });
            }
        }

        const transactionId = await InventoryTransaction.recordTransaction({
            product_id,
            user_id,
            type,
            quantity: parsedQuantity
        });

        res.status(201).json({ 
            message: 'Transaction recorded successfully', 
            transactionId 
        });
    } catch (error) {
        console.error('Error recording transaction:', error);
        res.status(500).json({ message: 'Server error recording transaction' });
    }
};
