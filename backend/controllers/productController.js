const Product = require('../models/productModel');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error fetching products' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error fetching product' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        // Image URL logic
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;
        
        // Destructure and parse values from req.body
        const productData = {
            ...req.body,
            image_url,
            quantity: parseInt(req.body.quantity) || 0,
            minimum_stock: parseInt(req.body.minimum_stock) || 5,
            purchase_price: parseFloat(req.body.purchase_price) || 0,
            selling_price: parseFloat(req.body.selling_price) || 0,
            category_id: req.body.category_id ? parseInt(req.body.category_id) : null,
            supplier_id: req.body.supplier_id ? parseInt(req.body.supplier_id) : null
        };

        if (!productData.name || !productData.purchase_price || !productData.selling_price) {
            return res.status(400).json({ message: 'Name, purchase price, and selling price are required' });
        }

        const newId = await Product.create(productData);
        res.status(201).json({ message: 'Product created successfully', id: newId });
    } catch (error) {
        console.error('Error creating product:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'SKU or Barcode already exists' });
        }
        res.status(500).json({ message: 'Server error creating product' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        // Find existing product first
        const existingProduct = await Product.findById(req.params.id);
        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let image_url = undefined; // undefined means do not update this field
        if (req.file) {
            image_url = `/uploads/${req.file.filename}`;
        }

        const productData = {
            ...req.body,
            image_url,
            quantity: req.body.quantity !== undefined ? parseInt(req.body.quantity) : existingProduct.quantity,
            minimum_stock: req.body.minimum_stock !== undefined ? parseInt(req.body.minimum_stock) : existingProduct.minimum_stock,
            purchase_price: req.body.purchase_price !== undefined ? parseFloat(req.body.purchase_price) : existingProduct.purchase_price,
            selling_price: req.body.selling_price !== undefined ? parseFloat(req.body.selling_price) : existingProduct.selling_price,
            category_id: req.body.category_id ? parseInt(req.body.category_id) : existingProduct.category_id,
            supplier_id: req.body.supplier_id ? parseInt(req.body.supplier_id) : existingProduct.supplier_id
        };

        const updated = await Product.update(req.params.id, productData);
        if (updated === 0) return res.status(404).json({ message: 'Product not found' });

        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'SKU or Barcode already exists' });
        }
        res.status(500).json({ message: 'Server error updating product' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.delete(req.params.id);
        if (deleted === 0) return res.status(404).json({ message: 'Product not found' });

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error deleting product' });
    }
};
