const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, supplierController.getAllSuppliers)
    .post(protect, adminOnly, supplierController.createSupplier);

router.route('/:id')
    .get(protect, supplierController.getSupplierById)
    .put(protect, adminOnly, supplierController.updateSupplier)
    .delete(protect, adminOnly, supplierController.deleteSupplier);

module.exports = router;
