const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

/**
 * Web Page Routes for User resources & HTML Views (Full Web CRUD)
 */

// 1. READ ALL - Render User List Page
router.get('/users', UserController.renderUserList);

// 2. CREATE - Create User via Web Action Form
router.post('/users', UserController.createUser);

// 3. EDIT FORM - Render Edit User Form Page (must come before /users/:id)
router.get('/users/:id/edit', UserController.renderEditForm);

// 4. READ ONE - Render User Detail Page
router.get('/users/:id', UserController.renderUserDetail);

// 5. UPDATE - Update User via Web Action (Form POST & HTTP PUT)
router.post('/users/:id/update', UserController.updateUser);
router.put('/users/:id', UserController.updateUser);

// 6. DELETE - Delete User via Web Action (Form POST & HTTP DELETE)
router.post('/users/:id/delete', UserController.deleteUser);
router.delete('/users/:id', UserController.deleteUser);

// Static Web Pages
router.get('/home', UserController.renderHome);
router.get('/about', UserController.renderAbout);

module.exports = router;
