/**
 * AnnouncementController - Web Page Controller for Announcement resources
 * Full CRUD Operations integrated with View Layer (AnnouncementViews):
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
  renderAnnouncementList(req, res) {
    const { sortBy = 'id', order = 'asc', category } = req.query;
    const announcements = AnnouncementModel.getAll({ sortBy, order, category });
    const htmlView = AnnouncementViews.renderAnnouncementListPage(announcements);
    res.send(htmlView);
  },

  /**
   * 2. READ ONE (GET /announcements/:id)
   */
  renderAnnouncementDetail(req, res) {
    const announcementId = req.params.id;
    const announcement = AnnouncementModel.getById(announcementId);

    if (!announcement) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="tr">
        <head><title>Duyuru Bulunamadı</title></head>
        <body style="font-family: sans-serif; background: #0f172a; color: #ef4444; text-align: center; padding: 50px;">
          <h1>404 - Duyuru Bulunamadı</h1>
          <p>ID'si ${announcementId} olan duyuru sistemde mevcut değil.</p>
          <a href="/announcements" style="color: #38bdf8;">Duyurulara Dön</a>
        </body>
        </html>
      `);
    }

    const htmlView = AnnouncementViews.renderAnnouncementDetailPage(announcement);
    res.send(htmlView);
  },

  /**
   * 3. EDIT FORM (GET /announcements/:id/edit)
   */
  renderEditForm(req, res) {
    const announcementId = req.params.id;
    const announcement = AnnouncementModel.getById(announcementId);

    if (!announcement) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="tr">
        <body style="font-family: sans-serif; background: #0f172a; color: #ef4444; text-align: center; padding: 50px;">
          <h1>404 - Düzenlenecek Duyuru Bulunamadı</h1>
          <a href="/announcements" style="color: #38bdf8;">Duyurulara Dön</a>
        </body>
        </html>
      `);
    }

    const htmlView = AnnouncementViews.renderAnnouncementEditPage(announcement);
    res.send(htmlView);
  },

  /**
   * 4. CREATE (POST /announcements)
   */
  createAnnouncement(req, res) {
    const payload = req.body;

    if (!payload || !payload.title || Object.keys(payload).length === 0) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html lang="tr">
        <body style="font-family: sans-serif; background: #0f172a; color: #ef4444; padding: 3rem; text-align: center;">
          <h2>Hata: Boş veya Geçersiz Veri</h2>
          <p>Lütfen duyuru başlığını doldurarak tekrar deneyiniz.</p>
          <a href="/announcements" style="color: #38bdf8;">Forma Dön</a>
        </body>
        </html>
      `);
    }

    // Convert checkbox value to boolean
    payload.isPinned = payload.isPinned === 'true' || payload.isPinned === true;

    const newAnnouncement = AnnouncementModel.create(payload);
    const htmlView = AnnouncementViews.renderAnnouncementCreatedPage(newAnnouncement);
    res.send(htmlView);
  },

  /**
   * 5. UPDATE (POST /announcements/:id/update & PUT /announcements/:id)
   */
  updateAnnouncement(req, res) {
    const announcementId = req.params.id;
    const payload = req.body;

    payload.isPinned = payload.isPinned === 'true' || payload.isPinned === true;

    const updatedAnnouncement = AnnouncementModel.update(announcementId, payload);

    if (!updatedAnnouncement) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="tr">
        <body style="font-family: sans-serif; background: #0f172a; color: #ef4444; text-align: center; padding: 50px;">
          <h1>404 - Güncellenecek Duyuru Bulunamadı</h1>
          <a href="/announcements" style="color: #38bdf8;">Duyurulara Dön</a>
        </body>
        </html>
      `);
    }

    const htmlView = AnnouncementViews.renderAnnouncementUpdatedPage(updatedAnnouncement);
    res.send(htmlView);
  },

  /**
   * 6. DELETE (POST /announcements/:id/delete & DELETE /announcements/:id)
   */
  deleteAnnouncement(req, res) {
    const announcementId = req.params.id;
    const deletedAnnouncement = AnnouncementModel.delete(announcementId);

    if (!deletedAnnouncement) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="tr">
        <body style="font-family: sans-serif; background: #0f172a; color: #ef4444; text-align: center; padding: 50px;">
          <h1>404 - Silinecek Duyuru Bulunamadı</h1>
          <a href="/announcements" style="color: #38bdf8;">Duyurulara Dön</a>
        </body>
        </html>
      `);
    }

    const htmlView = AnnouncementViews.renderAnnouncementDeletedPage(deletedAnnouncement);
    res.send(htmlView);
  }
};

module.exports = AnnouncementController;
