const express = require('express');
const router = express.Router();
const DepartmentController = require('../controllers/departmentController');

/**
 * Web Page Routes for Department resources & HTML Views
 * Direct Routes: /departments, /departments/:id
 * Nested Routes: /departments/:departmentId/job-postings
 */

// Direct Route: List all departments
router.get('/departments', DepartmentController.renderDepartmentList);

// Nested Route: List job postings for a specific department
router.get('/departments/:departmentId/job-postings', DepartmentController.renderDepartmentJobPostings);

// Direct Route: View single department detail
router.get('/departments/:id', DepartmentController.renderDepartmentDetail);

module.exports = router;
