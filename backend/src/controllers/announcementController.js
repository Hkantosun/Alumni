/**
 * AnnouncementController - Web Page Controller for Announcement resources
 * Full CRUD Operations integrated with PostgreSQL database and View Layer (AnnouncementViews):
 *   1. READ ALL   (GET /announcements)            -> renderAnnouncementList
 *   2. READ ONE   (GET /announcements/:id)        -> renderAnnouncementDetail
 *   3. EDIT FORM  (GET /announcements/:id/edit)   -> renderEditForm
 *   4. CREATE     (POST /announcements)           -> createAnnouncement
 *   5. UPDATE     (POST /announcements/:id/update -> updateAnnouncement
 *                  & PUT /announcements/:id)
 *   6. DELETE     (POST /announcements/:id/delete -> deleteAnnouncement
 *                  & DELETE /announcements/:id)
 */

const AnnouncementModel = require('../models/announcementModel');
const AnnouncementViews = require('../views/announcementViews');

const AnnouncementController = {
  /**
   * 1. READ ALL (GET /announcements)
   */
  async renderAnnouncementList(req, res) {
    try {
      const { sortBy = 'id', order = 'asc', category } = req.query;
      const announcements = await AnnouncementModel.getAll({ sortBy, order, category });
      const htmlView = AnnouncementViews.renderAnnouncementListPage(announcements, { categoryFilter: category });
      res.send(htmlView);
    } catch (err) {
      console.error('Error in renderAnnouncementList:', err);
      res.status(500).send('<h2>Veritabanı hatası: Duyurular yüklenemedi.</h2>');
    }
  },

  /**
   * 2. READ ONE (GET /announcements/:id)
   */
  async renderAnnouncementDetail(req, res) {
    try {
      const announcementId = req.params.id;
      const announcement = await AnnouncementModel.getById(announcementId);

      if (!announcement) {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html lang="tr">
          <head><title>Duyuru Bulunamadı</title></head>
          <body style="font-family: sans-serif; background: #0f172a; color: #ef4444; text-align: center; padding: 50px;">
            <h1>404 - Duyuru Bulunamadı</h1>
            <p>ID'si ${announcementId} olan duyuru sistemde mevcut değil.</p>
            <a href="/announcements" style="color: #6366f1;">Duyuru Listesine Dön</a>
          </body>
          </html>
        `);
      }

      const htmlView = AnnouncementViews.renderAnnouncementDetailPage(announcement);
      res.send(htmlView);
    } catch (err) {
      console.error('Error in renderAnnouncementDetail:', err);
      res.status(500).send('<h2>Veritabanı hatası: Duyuru detayı alınamadı.</h2>');
    }
  },

  /**
   * 3. EDIT FORM (GET /announcements/:id/edit)
   */
  async renderEditForm(req, res) {
    try {
      const announcementId = req.params.id;
      const announcement = await AnnouncementModel.getById(announcementId);

      if (!announcement) {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html lang="tr">
          <body style="font-family: sans-serif; background: #0f172a; color: #ef4444; text-align: center; padding: 50px;">
            <h1>404 - Düzenlenecek Duyuru Bulunamadı</h1>
            <a href="/announcements" style="color: #6366f1;">Listeye Dön</a>
          </body>
          </html>
        `);
      }

      const htmlView = AnnouncementViews.renderAnnouncementEditPage(announcement);
      res.send(htmlView);
    } catch (err) {
      console.error('Error in renderEditForm:', err);
      res.status(500).send('<h2>Veritabanı hatası: Düzenleme formu yüklenemedi.</h2>');
    }
  },

  /**
   * 4. CREATE (POST /announcements)
   */
  async createAnnouncement(req, res) {
    try {
      const payload = req.body;

      if (!payload || !payload.title || Object.keys(payload).length === 0) {
        return res.status(400).send(`
          <!DOCTYPE html>
          <html lang="tr">
          <body style="font-family: sans-serif; background: #0f172a; color: #ef4444; padding: 3rem; text-align: center;">
            <h2>Hata: Başlık Alanı Zorunludur</h2>
            <p>Lütfen duyuru başlığını doldurarak tekrar deneyiniz.</p>
            <a href="/announcements" style="color: #6366f1;">Forma Dön</a>
          </body>
          </html>
        `);
      }

      const newAnnouncement = await AnnouncementModel.create(payload);
      const htmlView = AnnouncementViews.renderAnnouncementCreatedPage(newAnnouncement);
      res.send(htmlView);
    } catch (err) {
      console.error('Error in createAnnouncement:', err);
      res.status(500).send('<h2>Veritabanı hatası: Duyuru kaydedilemedi: ' + err.message + '</h2>');
    }
  },

  /**
   * 5. UPDATE (POST /announcements/:id/update & PUT /announcements/:id)
   */
  async updateAnnouncement(req, res) {
    try {
      const announcementId = req.params.id;
      const payload = req.body;

      const updatedAnnouncement = await AnnouncementModel.update(announcementId, payload);

      if (!updatedAnnouncement) {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html lang="tr">
          <body style="font-family: sans-serif; background: #0f172a; color: #ef4444; padding: 3rem; text-align: center;">
            <h2>Hata: 404 - Güncellenecek Duyuru Bulunamadı</h2>
            <a href="/announcements" style="color: #6366f1;">Listeye Dön</a>
          </body>
          </html>
        `);
      }

      const htmlView = AnnouncementViews.renderAnnouncementUpdatedPage(updatedAnnouncement);
      res.send(htmlView);
    } catch (err) {
      console.error('Error in updateAnnouncement:', err);
      res.status(500).send('<h2>Veritabanı hatası: Duyuru güncellenemedi: ' + err.message + '</h2>');
    }
  },

  /**
   * 6. DELETE (POST /announcements/:id/delete & DELETE /announcements/:id)
   */
  async deleteAnnouncement(req, res) {
    try {
      const announcementId = req.params.id;
      const deletedAnnouncement = await AnnouncementModel.delete(announcementId);

      if (!deletedAnnouncement) {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html lang="tr">
          <body style="font-family: sans-serif; background: #0f172a; color: #ef4444; padding: 3rem; text-align: center;">
            <h2>Hata: 404 - Silinecek Duyuru Bulunamadı</h2>
            <a href="/announcements" style="color: #6366f1;">Listeye Dön</a>
          </body>
          </html>
        `);
      }

      const htmlView = AnnouncementViews.renderAnnouncementDeletedPage(deletedAnnouncement);
      res.send(htmlView);
    } catch (err) {
      console.error('Error in deleteAnnouncement:', err);
      res.status(500).send('<h2>Veritabanı hatası: Duyuru silinemedi: ' + err.message + '</h2>');
    }
  }
};

module.exports = AnnouncementController;
