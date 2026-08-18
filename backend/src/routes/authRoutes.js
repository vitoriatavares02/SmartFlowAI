const express = require('express');
const router = express.Router();
const { login, getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/authController');

// Authentication & User Management Routes
router.post('/login', login);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
