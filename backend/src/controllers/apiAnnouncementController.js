/**
 * ApiAnnouncementController - REST API Controller for Announcement resources
 * Handles JSON requests, payload validations, and PostgreSQL database operations.
 */

const AnnouncementModel = require('../models/announcementModel');

const ApiAnnouncementController = {
  /**
   * GET /api/announcements
   * Retrieve all announcements with optional sorting (sortBy, order) and category filter.
   */
  async getAnnouncements(req, res) {
    try {
      const { sortBy = 'id', order = 'asc', category } = req.query;
      const announcements = await AnnouncementModel.getAll({ sortBy, order, category });

      res.json({
        count: announcements.length,
        sortBy,
        order,
        categoryFilter: category || null,
        announcements
      });
    } catch (err) {
      console.error('Error in getAnnouncements:', err);
      res.status(500).json({ error: 'Duyurular veritabanından alınırken hata oluştu.' });
    }
  },

  /**
   * GET /api/announcements/:id
   * Retrieve a single announcement entity by ID.
   */
  async getAnnouncementById(req, res) {
    try {
      const announcementId = req.params.id;
      const announcement = await AnnouncementModel.getById(announcementId);

      if (!announcement) {
        return res.status(404).json({
          error: `ID'si ${announcementId} olan duyuru bulunamadı.`
        });
      }

      res.json({ announcement });
    } catch (err) {
      console.error('Error in getAnnouncementById:', err);
      res.status(500).json({ error: 'Duyuru sorgulanırken hata oluştu.' });
    }
  },

  /**
   * POST /api/announcements
   * Create a new announcement record in PostgreSQL.
   */
  async createAnnouncement(req, res) {
    try {
      const payload = req.body;

      if (!payload || !payload.title || Object.keys(payload).length === 0) {
        return res.status(400).json({
          error: 'Gönderilen veri boş olamaz ve duyuru başlığı (title) zorunludur.'
        });
      }

      const newAnnouncement = await AnnouncementModel.create(payload);

      res.status(201).json({
        message: 'Duyuru başarıyla oluşturuldu ve veritabanına kaydedildi',
        announcement: newAnnouncement
      });
    } catch (err) {
      console.error('Error in createAnnouncement:', err);
      res.status(500).json({ error: 'Duyuru veritabanına kaydedilirken hata oluştu: ' + err.message });
    }
  },

  /**
   * PUT /api/announcements/:id
   * Fully update an existing announcement record by ID.
   */
  async updateAnnouncement(req, res) {
    try {
      const announcementId = req.params.id;
      const payload = req.body;

      if (!payload || Object.keys(payload).length === 0) {
        return res.status(400).json({
          error: 'PUT isteğinde güncellenecek veri (body) boş olamaz.'
        });
      }

      const updatedAnnouncement = await AnnouncementModel.update(announcementId, payload);

      if (!updatedAnnouncement) {
        return res.status(404).json({
          error: `ID'si ${announcementId} olan duyuru bulunamadı.`
        });
      }

      res.json({
        message: 'Duyuru verisi tamamen güncellendi (PUT)',
        announcement: updatedAnnouncement
      });
    } catch (err) {
      console.error('Error in updateAnnouncement:', err);
      res.status(500).json({ error: 'Duyuru güncellenirken hata oluştu: ' + err.message });
    }
  },

  /**
   * PATCH /api/announcements/:id
   * Partially update specified attributes of an announcement by ID.
   */
  async patchAnnouncement(req, res) {
    try {
      const announcementId = req.params.id;
      const payload = req.body;

      if (!payload || Object.keys(payload).length === 0) {
        return res.status(400).json({
          error: 'PATCH isteğinde güncellenecek veri boş olamaz.'
        });
      }

      const updatedAnnouncement = await AnnouncementModel.patch(announcementId, payload);

      if (!updatedAnnouncement) {
        return res.status(404).json({
          error: `ID'si ${announcementId} olan duyuru bulunamadı.`
        });
      }

      res.json({
        message: 'Duyuru verisi kısmi olarak güncellendi (PATCH)',
        announcement: updatedAnnouncement
      });
    } catch (err) {
      console.error('Error in patchAnnouncement:', err);
      res.status(500).json({ error: 'Duyuru güncellenirken hata oluştu: ' + err.message });
    }
  },

  /**
   * DELETE /api/announcements/:id
   * Delete a specific announcement by ID.
   */
  async deleteAnnouncement(req, res) {
    try {
      const announcementId = req.params.id;
      const deletedAnnouncement = await AnnouncementModel.delete(announcementId);

      if (!deletedAnnouncement) {
        return res.status(404).json({
          error: `ID'si ${announcementId} olan duyuru bulunamadı.`
        });
      }

      res.json({
        message: `ID'si ${announcementId} olan duyuru başarıyla silindi.`,
        deletedAnnouncement
      });
    } catch (err) {
      console.error('Error in deleteAnnouncement:', err);
      res.status(500).json({ error: 'Duyuru silinirken hata oluştu: ' + err.message });
    }
  }
};

module.exports = ApiAnnouncementController;
