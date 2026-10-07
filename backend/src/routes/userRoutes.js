const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

/**
 * Web Page Routes for User resources & HTML Views
 * Base URL: / (or /users)
 */

// GET /users - Render HTML User List Page
router.get('/users', UserController.renderUserList);

// GET /users/:id - Render HTML User Detail Page
router.get('/users/:id', UserController.renderUserDetail);

// POST /users - Create User via Web Action
router.post('/users', UserController.createUser);

// PUT /users/:id - Update User via Web Action
router.put('/users/:id', UserController.updateUser);

// DELETE /users/:id - Delete User via Web Action
router.delete('/users/:id', UserController.deleteUser);

// GET /home - Temporary Main Page
router.get('/home', UserController.renderHome);

// GET /about - Temporary About Page
router.get('/about', UserController.renderAbout);

module.exports = router;
