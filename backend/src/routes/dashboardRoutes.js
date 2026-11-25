const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');
const { authenticate, checkAccountStatus, authorize } = require('../middlewares/authMiddleware');

router.use(authenticate, checkAccountStatus());

router.get('/', DashboardController.renderDashboard);
router.post('/mentorship-request', authorize('student'), DashboardController.createMentorshipRequest);
router.post('/mentorship-requests/:id/respond', authorize('alumni'), DashboardController.respondMentorshipRequest);
router.post('/toggle-mentorship', authorize('alumni'), DashboardController.toggleMentorshipAvailability);
router.post('/announcements', authorize('academic_staff', 'admin'), DashboardController.createAnnouncement);

module.exports = router;
