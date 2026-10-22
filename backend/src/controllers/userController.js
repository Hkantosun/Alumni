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
const JobPostingModel = require('../models/jobPostingModel');
const DepartmentModel = require('../models/departmentModel');
const ApplicationModel = require('../models/applicationModel');
const UserViews = require('../views/userViews');
const HomeView = require('../views/homeView');

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

  async renderHomePage(req, res) {
    try {
      const [users, jobPostings, applications, departments] = await Promise.all([
        UserModel.getAll(),
        JobPostingModel.getAll(),
        ApplicationModel.getAll(),
        DepartmentModel.getAll()
      ]);

      const html = HomeView.renderHomePage({
        users,
        jobPostings,
        applications,
        departments
      });

      res.send(html);
    } catch (err) {
      console.error("Error in renderHomePage:", err);
      res.status(500).send("Ana sayfa yüklenirken hata oluştu: " + err.message);
    }
  },

  renderAboutPage(req, res) {
    res.send(HomeView.renderAboutPage());
  }
};

module.exports = UserController;
