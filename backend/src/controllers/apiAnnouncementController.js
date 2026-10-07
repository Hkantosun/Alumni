/**
 * ApiAnnouncementController - REST API Controller for Announcement resources
 * Handles JSON requests, payload validations, and HTTP response formatting.
 */

const AnnouncementModel = require('../models/announcementModel');

const ApiAnnouncementController = {
  /**
   * GET /api/announcements
   * Retrieve all announcements with optional sorting (sortBy, order) and category filter.
   */
  getAnnouncements(req, res) {
    const { sortBy = 'id', order = 'asc', category } = req.query;
    const announcements = AnnouncementModel.getAll({ sortBy, order, category });

    res.json({
      count: announcements.length,
      sortBy,
      order,
      categoryFilter: category || null,
      announcements
    });
  },

  /**
   * GET /api/announcements/:id
   * Retrieve a single announcement entity by ID.
   */
  getAnnouncementById(req, res) {
    const announcementId = req.params.id;
    const announcement = AnnouncementModel.getById(announcementId);

    if (!announcement) {
      return res.status(404).json({
        error: `ID'si ${announcementId} olan duyuru bulunamadı.`
      });
    }

    res.json({ announcement });
  },

  /**
   * POST /api/announcements
   * Create a new announcement record.
   */
  createAnnouncement(req, res) {
    const payload = req.body;

    if (!payload || !payload.title || Object.keys(payload).length === 0) {
      return res.status(400).json({
        error: 'Gönderilen veri boş olamaz ve duyuru başlığı (title) zorunludur.'
      });
    }

    const newAnnouncement = AnnouncementModel.create(payload);

    res.status(201).json({
      message: 'Duyuru başarıyla oluşturuldu ve kaydedildi',
      announcement: newAnnouncement
    });
  },

  /**
   * PUT /api/announcements/:id
   * Fully update an existing announcement record by ID.
   */
  updateAnnouncement(req, res) {
    const announcementId = req.params.id;
    const payload = req.body;

    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({
        error: 'PUT isteğinde güncellenecek veri (body) boş olamaz.'
      });
    }

    const updatedAnnouncement = AnnouncementModel.update(announcementId, payload);

    if (!updatedAnnouncement) {
      return res.status(404).json({
        error: `ID'si ${announcementId} olan duyuru bulunamadı.`
      });
    }

    res.json({
      message: 'Duyuru verisi tamamen güncellendi (PUT)',
      announcement: updatedAnnouncement
    });
  },

  /**
   * PATCH /api/announcements/:id
   * Partially update specified attributes of an announcement by ID.
   */
  patchAnnouncement(req, res) {
    const announcementId = req.params.id;
    const payload = req.body;

    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({
        error: 'PATCH isteğinde güncellenecek veri alanı bulunamadı.'
      });
    }

    const updatedAnnouncement = AnnouncementModel.patch(announcementId, payload);

    if (!updatedAnnouncement) {
      return res.status(404).json({
        error: `ID'si ${announcementId} olan duyuru bulunamadı.`
      });
    }

    res.json({
      message: 'Duyuru verisi kısmen güncellendi (PATCH)',
      announcement: updatedAnnouncement
    });
  },

  /**
   * DELETE /api/announcements/:id
   * Remove an announcement record by ID.
   */
  deleteAnnouncement(req, res) {
    const announcementId = req.params.id;
    const deletedAnnouncement = AnnouncementModel.delete(announcementId);

    if (!deletedAnnouncement) {
      return res.status(404).json({
        error: `ID'si ${announcementId} olan duyuru bulunamadı.`
      });
    }

    res.json({
      message: `ID'si ${announcementId} olan duyuru başarıyla silindi.`,
      deletedAnnouncement,
      remainingCount: AnnouncementModel.count()
    });
  }
};

module.exports = ApiAnnouncementController;
