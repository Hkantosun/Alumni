const express = require('express');
const router = express.Router();
const ApiAnnouncementController = require('../controllers/apiAnnouncementController');

/**
 * REST API Routes for Announcement resources
 * Base URL: /api/announcements
 */

// GET /api/announcements - List all announcements (supports sortBy, order, category)
router.get('/', ApiAnnouncementController.getAnnouncements);

// POST /api/announcements - Create new announcement record
router.post('/', ApiAnnouncementController.createAnnouncement);

// GET /api/announcements/:id - Get specific announcement by ID
router.get('/:id', ApiAnnouncementController.getAnnouncementById);

// PUT /api/announcements/:id - Full update announcement record
router.put('/:id', ApiAnnouncementController.updateAnnouncement);

// PATCH /api/announcements/:id - Partial update announcement record
router.patch('/:id', ApiAnnouncementController.patchAnnouncement);

// DELETE /api/announcements/:id - Delete announcement record
router.delete('/:id', ApiAnnouncementController.deleteAnnouncement);

module.exports = router;
