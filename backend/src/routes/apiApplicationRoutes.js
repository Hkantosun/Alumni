const express = require('express');
// mergeParams: true allows inheriting :jobPostingId and :userId from parent routers
const router = express.Router({ mergeParams: true });
const ApiApplicationController = require('../controllers/apiApplicationController');

/**
 * REST API Routes for Application resources
 * Mount points:
 *   - Direct: /api/applications
 *   - Nested: /api/job-postings/:jobPostingId/applications
 *   - Nested: /api/users/:userId/applications
 */

// GET / - List applications (direct or filtered by nested jobPostingId / userId)
router.get('/', ApiApplicationController.getApplications);

// POST / - Create application (inherits jobPostingId / userId if nested)
router.post('/', ApiApplicationController.createApplication);

// GET /:id - Get specific application by ID
router.get('/:id', ApiApplicationController.getApplicationById);

// PUT /:id - Full update application
router.put('/:id', ApiApplicationController.updateApplication);

// PATCH /:id - Partial update application
router.patch('/:id', ApiApplicationController.patchApplication);

// DELETE /:id - Delete application
router.delete('/:id', ApiApplicationController.deleteApplication);

module.exports = router;
