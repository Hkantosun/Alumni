const express = require('express');
const router = express.Router();
const ApiDepartmentController = require('../controllers/apiDepartmentController');

/**
 * REST API Routes for Department resources
 * Base URL: /api/departments
 */

// Direct Routes:
// GET /api/departments - List all departments
router.get('/', ApiDepartmentController.getDepartments);

// POST /api/departments - Create new department
router.post('/', ApiDepartmentController.createDepartment);

// GET /api/departments/:id - Get specific department by ID
router.get('/:id', ApiDepartmentController.getDepartmentById);

// PUT /api/departments/:id - Update department
router.put('/:id', ApiDepartmentController.updateDepartment);

// DELETE /api/departments/:id - Delete department
router.delete('/:id', ApiDepartmentController.deleteDepartment);

// Nested Route:
// GET /api/departments/:departmentId/job-postings - Get job postings for specific department
router.get('/:departmentId/job-postings', ApiDepartmentController.getDepartmentJobPostings);

module.exports = router;
