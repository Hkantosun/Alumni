/**
 * UserController - Web Page Controller for User resources
 * Full CRUD Operations integrated with PostgreSQL database and View Layer (UserViews):
 *   1. READ ALL   (GET /users)            -> renderUserList
 *   2. READ ONE   (GET /users/:id)        -> renderUserDetail
 *   3. EDIT FORM  (GET /users/:id/edit)   -> renderEditForm
 *   4. CREATE     (POST /users)           -> createUser
 *   5. UPDATE     (POST /users/:id/update -> updateUser
 *                  & PUT /users/:id)
 *   6. DELETE     (POST /users/:id/delete -> deleteUser
 *                  & DELETE /users/:id)
 */

const UserModel = require('../models/userModel');
const UserViews = require('../views/userViews');

const UserController = {
  /**
   * 1. READ ALL (GET /users)
   */
  async renderUserList(req, res) {
    try {
      const { sortBy = 'id', order = 'asc' } = req.query;
      const users = await UserModel.getAll({ sortBy, order });
      const htmlView = UserViews.renderUserListPage(users);
      res.send(htmlView);
    } catch (err) {
      console.error('Error in renderUserList:', err);
      res.status(500).send('<h2>Veritabanı hatası: Kullanıcı listesi alınamadı.</h2>');
    }
  },

  /**
   * 2. READ ONE (GET /users/:id)
   */
  async renderUserDetail(req, res) {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await UserModel.getById(userId);

      if (!user) {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html lang="tr">
          <head><title>Kullanıcı Bulunamadı</title></head>
          <body style="font-family: sans-serif; background: #0f172a; color: #ef4444; text-align: center; padding: 50px;">
            <h1>404 - Kullanıcı Bulunamadı</h1>
            <p>ID'si ${userId} olan kullanıcı sistemde mevcut değil.</p>
            <a href="/users" style="color: #6366f1;">Listeye Dön</a>
          </body>
          </html>
        `);
      }

      const htmlView = UserViews.renderUserDetailPage(user);
      res.send(htmlView);
    } catch (err) {
      console.error('Error in renderUserDetail:', err);
      res.status(500).send('<h2>Veritabanı hatası: Kullanıcı detayı alınamadı.</h2>');
    }
  },

  /**
   * 3. EDIT FORM (GET /users/:id/edit)
   */
  async renderEditForm(req, res) {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await UserModel.getById(userId);

      if (!user) {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html lang="tr">
          <body style="font-family: sans-serif; background: #0f172a; color: #ef4444; text-align: center; padding: 50px;">
            <h1>404 - Düzenlenecek Kullanıcı Bulunamadı</h1>
            <a href="/users" style="color: #6366f1;">Listeye Dön</a>
          </body>
          </html>
        `);
      }

      const htmlView = UserViews.renderUserEditPage(user);
      res.send(htmlView);
    } catch (err) {
      console.error('Error in renderEditForm:', err);
      res.status(500).send('<h2>Veritabanı hatası: Düzenleme formu yüklenemedi.</h2>');
    }
  },

  /**
   * 4. CREATE (POST /users)
   */
  async createUser(req, res) {
    try {
      const payload = req.body;

      if (!payload || !payload.name || Object.keys(payload).length === 0) {
        return res.status(400).send(`
          <!DOCTYPE html>
          <html lang="tr">
          <body style="font-family: sans-serif; background: #0f172a; color: #ef4444; padding: 3rem; text-align: center;">
            <h2>Hata: Boş veya Geçersiz Veri</h2>
            <p>Lütfen isim ve e-posta alanlarını doldurarak tekrar deneyiniz.</p>
            <a href="/users" style="color: #6366f1;">Forma Dön</a>
          </body>
          </html>
        `);
      }

      const newUser = await UserModel.create(payload);
      const htmlView = UserViews.renderUserCreatedPage(newUser);
      res.send(htmlView);
    } catch (err) {
      console.error('Error in createUser:', err);
      res.status(500).send('<h2>Veritabanı hatası: Kullanıcı kaydedilemedi: ' + err.message + '</h2>');
    }
  },

  /**
   * 5. UPDATE (POST /users/:id/update & PUT /users/:id)
   */
  async updateUser(req, res) {
    try {
      const userId = parseInt(req.params.id, 10);
      const payload = req.body;

      const updatedUser = await UserModel.update(userId, payload);

      if (!updatedUser) {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html lang="tr">
          <body style="font-family: sans-serif; background: #0f172a; color: #ef4444; padding: 3rem; text-align: center;">
            <h2>Hata: 404 - Güncellenecek Kullanıcı Bulunamadı</h2>
            <a href="/users" style="color: #6366f1;">Listeye Dön</a>
          </body>
          </html>
        `);
      }

      const htmlView = UserViews.renderUserUpdatedPage(updatedUser);
      res.send(htmlView);
    } catch (err) {
      console.error('Error in updateUser:', err);
      res.status(500).send('<h2>Veritabanı hatası: Kullanıcı güncellenemedi: ' + err.message + '</h2>');
    }
  },

  /**
   * 6. DELETE (POST /users/:id/delete & DELETE /users/:id)
   */
  async deleteUser(req, res) {
    try {
      const userId = parseInt(req.params.id, 10);
      const deletedUser = await UserModel.delete(userId);

      if (!deletedUser) {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html lang="tr">
          <body style="font-family: sans-serif; background: #0f172a; color: #ef4444; padding: 3rem; text-align: center;">
            <h2>Hata: 404 - Silinecek Kullanıcı Bulunamadı</h2>
            <a href="/users" style="color: #6366f1;">Listeye Dön</a>
          </body>
          </html>
        `);
      }

      const htmlView = UserViews.renderUserDeletedPage(deletedUser);
      res.send(htmlView);
    } catch (err) {
      console.error('Error in deleteUser:', err);
      res.status(500).send('<h2>Veritabanı hatası: Kullanıcı silinemedi: ' + err.message + '</h2>');
    }
  },

  renderHome(req, res) {
    return UserController.renderHomePage(req, res);
  },

  renderAbout(req, res) {
    return UserController.renderAboutPage(req, res);
  },

  renderHomePage(req, res) {
    res.send(`
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>Alumni Tracking System - Ana Sayfa</title>
        <style>
          body { font-family: 'Inter', system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 3rem; margin: 0; text-align: center; }
          .hero { max-width: 700px; margin: 4rem auto; background: #1e293b; padding: 3rem; border-radius: 16px; border: 1px solid #334155; }
          h1 { color: #818cf8; font-size: 2.2rem; margin-bottom: 1rem; }
          p { color: #94a3b8; line-height: 1.6; }
          .nav-btns { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; flex-wrap: wrap; }
          .btn { padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; }
          .btn-primary { background: #6366f1; color: white; }
          .btn-secondary { background: #334155; color: #38bdf8; }
        </style>
      </head>
      <body>
        <div class="hero">
          <h1>🎓 Alumni Tracking System</h1>
          <p>Mezunlar, öğrenciler ve akademisyenleri buluşturan PostgreSQL destekli web platformu.</p>
          <div class="nav-btns">
            <a href="/users" class="btn btn-primary">👥 Kullanıcı CRUD Paneli</a>
            <a href="/announcements" class="btn btn-secondary">📢 Duyuru CRUD Paneli</a>
            <a href="/api/swagger" class="btn btn-secondary">📚 Swagger API Dokümantasyonu</a>
          </div>
        </div>
      </body>
      </html>
    `);
  },

  renderAboutPage(req, res) {
    res.send(`
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>Hakkında - Alumni Tracking System</title>
        <style>
          body { font-family: 'Inter', system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 3rem; margin: 0; }
          .box { max-width: 600px; margin: 2rem auto; background: #1e293b; padding: 2rem; border-radius: 12px; border: 1px solid #334155; }
          h1 { color: #818cf8; }
          a { color: #6366f1; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>ℹ️ Proje Hakkında</h1>
          <p>Bu sistem Web Programlama dersi kapsamında geliştirilmektedir. MVC mimarisi ve PostgreSQL 16 veritabanı ile tam CRUD özelliklerine sahiptir.</p>
          <p><a href="/users">← Kullanıcı Listesine Dön</a> | <a href="/home">Ana Sayfa</a></p>
        </div>
      </body>
      </html>
    `);
  }
};

module.exports = UserController;
