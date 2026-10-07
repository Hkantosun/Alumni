const express = require('express');
const router = express.Router();
const ApiUserController = require('../controllers/apiUserController');

/**
 * REST API Routes for User resources
 * Base URL: /api/users
 */

// GET /api/users - List all users (supports sortBy, order)
router.get('/', ApiUserController.getUsers);

// POST /api/users - Create new user record
router.post('/', ApiUserController.createUser);

// GET /api/users/:id - Get specific user by ID
router.get('/:id', ApiUserController.getUserById);

// PUT /api/users/:id - Full update user record
router.put('/:id', ApiUserController.updateUser);

// PATCH /api/users/:id - Partial update user record
router.patch('/:id', ApiUserController.patchUser);

// DELETE /api/users/:id - Delete user record
router.delete('/:id', ApiUserController.deleteUser);

module.exports = router;
