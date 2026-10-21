const express = require('express');
// mergeParams: true allows inheriting :jobPostingId and :userId from parent routers
const router = express.Router({ mergeParams: true });
const ApplicationController = require('../controllers/applicationController');

/**
 * Web Page Routes for Application resources & HTML Views
 * Mount points:
 *   - Direct: /applications
 *   - Nested: /job-postings/:jobPostingId/applications
 *   - Nested: /users/:userId/applications
 */

// 1. READ ALL - Render Application List (Direct or Nested)
router.get('/', ApplicationController.renderApplicationList);

// 2. CREATE - Submit application via Web Form
router.post('/', ApplicationController.createApplication);

// 3. EDIT FORM - Render Edit Application Form
router.get('/:id/edit', ApplicationController.renderEditForm);

// 4. READ ONE - Render Application Detail Page
router.get('/:id', ApplicationController.renderApplicationDetail);

// 5. UPDATE - Update Application via Web Action
router.post('/:id/update', ApplicationController.updateApplication);
router.put('/:id', ApplicationController.updateApplication);

// 6. DELETE - Delete Application via Web Action
router.post('/:id/delete', ApplicationController.deleteApplication);
router.delete('/:id', ApplicationController.deleteApplication);

module.exports = router;
