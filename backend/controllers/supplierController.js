const Supplier = require('../models/supplierModel');

exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.findAll();
        res.json(suppliers);
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).json({ message: 'Server error fetching suppliers' });
    }
};

exports.getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        res.json(supplier);
    } catch (error) {
        console.error('Error fetching supplier:', error);
        res.status(500).json({ message: 'Server error fetching supplier' });
    }
};

exports.createSupplier = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        if (!name) return res.status(400).json({ message: 'Supplier name is required' });

        const newId = await Supplier.create({ name, email, phone, address });
        res.status(201).json({ message: 'Supplier created successfully', id: newId });
    } catch (error) {
        console.error('Error creating supplier:', error);
        res.status(500).json({ message: 'Server error creating supplier' });
    }
};

exports.updateSupplier = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        if (!name) return res.status(400).json({ message: 'Supplier name is required' });

        const updated = await Supplier.update(req.params.id, { name, email, phone, address });
        if (updated === 0) return res.status(404).json({ message: 'Supplier not found' });

        res.json({ message: 'Supplier updated successfully' });
    } catch (error) {
        console.error('Error updating supplier:', error);
        res.status(500).json({ message: 'Server error updating supplier' });
    }
};

exports.deleteSupplier = async (req, res) => {
    try {
        const deleted = await Supplier.delete(req.params.id);
        if (deleted === 0) return res.status(404).json({ message: 'Supplier not found' });

        res.json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        console.error('Error deleting supplier:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'Cannot delete supplier because it is referenced by existing products' });
        }
        res.status(500).json({ message: 'Server error deleting supplier' });
    }
};
