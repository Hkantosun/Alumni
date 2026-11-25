const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { authenticate, checkAccountStatus, authorize } = require('../middlewares/authMiddleware');

// All /admin routes require authenticated, active admin user
router.use(authenticate, checkAccountStatus(), authorize('admin'));

router.get('/', AdminController.renderDashboard);

// User & Role manipulation
router.post('/users/:id/role', AdminController.updateUserRole);
router.post('/users/:id/toggle-active', AdminController.toggleUserActive);
router.post('/users/:id/toggle-verified', AdminController.toggleUserVerified);
router.post('/users/:id/delete', AdminController.deleteUser);

// Department manipulation
router.post('/departments', AdminController.createDepartment);
router.post('/departments/:id/delete', AdminController.deleteDepartment);

// Announcement manipulation
router.post('/announcements', AdminController.createAnnouncement);
router.post('/announcements/:id/toggle-pin', AdminController.toggleAnnouncementPin);
router.post('/announcements/:id/delete', AdminController.deleteAnnouncement);

// Job Posting & Application manipulation
router.post('/job-postings/:id/toggle-active', AdminController.toggleJobPostingActive);
router.post('/job-postings/:id/delete', AdminController.deleteJobPosting);
router.post('/applications/:id/status', AdminController.updateApplicationStatus);

module.exports = router;
