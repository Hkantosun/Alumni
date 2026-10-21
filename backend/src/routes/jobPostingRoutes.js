const express = require('express');
// mergeParams: true allows accessing :departmentId and :userId when mounted on nested paths
const router = express.Router({ mergeParams: true });
const JobPostingController = require('../controllers/jobPostingController');

/**
 * Web Page Routes for Job Posting resources & HTML Views
 * Mount points:
 *   - Direct: /job-postings
 *   - Nested: /departments/:departmentId/job-postings
 *   - Nested: /users/:userId/job-postings
 */

// 1. READ ALL - Render Job Postings List Page (Direct or Nested)
router.get('/', JobPostingController.renderJobPostingList);

// 2. CREATE - Create Job Posting via Web Form Action
router.post('/', JobPostingController.createJobPosting);

// 3. EDIT FORM - Render Edit Job Posting Form
router.get('/:id/edit', JobPostingController.renderEditForm);

// 4. READ ONE - Render Job Posting Detail Page
router.get('/:id', JobPostingController.renderJobPostingDetail);

// 5. UPDATE - Update Job Posting via Web Form Action (POST & PUT)
router.post('/:id/update', JobPostingController.updateJobPosting);
router.put('/:id', JobPostingController.updateJobPosting);

// 6. DELETE - Delete Job Posting via Web Action (POST & DELETE)
router.post('/:id/delete', JobPostingController.deleteJobPosting);
router.delete('/:id', JobPostingController.deleteJobPosting);

module.exports = router;
