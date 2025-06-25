const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET all users
router.get('/', userController.getAllUsers);
// GET user by id
router.get('/:id', userController.getUserById);

module.exports = router;
