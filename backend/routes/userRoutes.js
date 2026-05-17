const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, adminOnly, userController.getAllUsers)
    .post(protect, adminOnly, userController.createUser);

router.route('/:id/role')
    .put(protect, adminOnly, userController.updateUserRole);

router.route('/:id')
    .delete(protect, adminOnly, userController.deleteUser);

module.exports = router;
