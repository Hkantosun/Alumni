const express = require('express');
const router = express.Router();
const AnnouncementController = require('../controllers/announcementController');

/**
 * Web Page Routes for Announcement resources & HTML Views (Full Web CRUD)
 */

// 1. READ ALL - Render Announcement List Page
router.get('/announcements', AnnouncementController.renderAnnouncementList);

// 2. CREATE - Create Announcement via Web Action Form
router.post('/announcements', AnnouncementController.createAnnouncement);

// 3. EDIT FORM - Render Edit Announcement Form Page (must come before /announcements/:id)
router.get('/announcements/:id/edit', AnnouncementController.renderEditForm);

// 4. READ ONE - Render Announcement Detail Page
router.get('/announcements/:id', AnnouncementController.renderAnnouncementDetail);

// 5. UPDATE - Update Announcement via Web Action (Form POST & HTTP PUT)
router.post('/announcements/:id/update', AnnouncementController.updateAnnouncement);
router.put('/announcements/:id', AnnouncementController.updateAnnouncement);

// 6. DELETE - Delete Announcement via Web Action (Form POST & HTTP DELETE)
router.post('/announcements/:id/delete', AnnouncementController.deleteAnnouncement);
router.delete('/announcements/:id', AnnouncementController.deleteAnnouncement);

module.exports = router;
