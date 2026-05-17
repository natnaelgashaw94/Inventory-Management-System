const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, categoryController.getAllCategories)
    .post(protect, adminOnly, categoryController.createCategory);

router.route('/:id')
    .get(protect, categoryController.getCategoryById)
    .put(protect, adminOnly, categoryController.updateCategory)
    .delete(protect, adminOnly, categoryController.deleteCategory);

module.exports = router;
