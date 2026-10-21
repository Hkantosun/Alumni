const express = require('express');
// mergeParams: true allows accessing params from parent routers (:departmentId, :userId)
const router = express.Router({ mergeParams: true });
const ApiJobPostingController = require('../controllers/apiJobPostingController');

/**
 * REST API Routes for Job Posting resources
 * Mount points:
 *   - Direct: /api/job-postings
 *   - Nested: /api/departments/:departmentId/job-postings
 *   - Nested: /api/users/:userId/job-postings
 */

// GET / - List job postings (direct or filtered by nested departmentId / userId)
router.get('/', ApiJobPostingController.getJobPostings);

// POST / - Create new job posting (inherits departmentId / userId if nested)
router.post('/', ApiJobPostingController.createJobPosting);

// GET /:id - Get specific job posting by ID
router.get('/:id', ApiJobPostingController.getJobPostingById);

// PUT /:id - Full update job posting
router.put('/:id', ApiJobPostingController.updateJobPosting);

// PATCH /:id - Partial update job posting
router.patch('/:id', ApiJobPostingController.patchJobPosting);

// DELETE /:id - Delete job posting
router.delete('/:id', ApiJobPostingController.deleteJobPosting);

module.exports = router;
