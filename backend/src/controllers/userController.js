/**
 * UserController - Web Page Controller for User resources
 * Full CRUD Operations integrated with View Layer (UserViews):
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
  renderUserList(req, res) {
    const { sortBy = 'id', order = 'asc' } = req.query;
    const users = UserModel.getAll({ sortBy, order });
    const htmlView = UserViews.renderUserListPage(users);
    res.send(htmlView);
  },

  /**
   * 2. READ ONE (GET /users/:id)
   */
  renderUserDetail(req, res) {
    const userId = parseInt(req.params.id, 10);
    const user = UserModel.getById(userId);

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
  },

  /**
   * 3. EDIT FORM (GET /users/:id/edit)
   */
  renderEditForm(req, res) {
    const userId = parseInt(req.params.id, 10);
    const user = UserModel.getById(userId);

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
  },

  /**
   * 4. CREATE (POST /users)
   */
  createUser(req, res) {
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

    const newUser = UserModel.create(payload);
    const htmlView = UserViews.renderUserCreatedPage(newUser);
    res.send(htmlView);
  },

  /**
   * 5. UPDATE (POST /users/:id/update & PUT /users/:id)
   */
  updateUser(req, res) {
    const userId = parseInt(req.params.id, 10);
    const payload = req.body;

    const updatedUser = UserModel.update(userId, payload);

    if (!updatedUser) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="tr">
        <body style="font-family: sans-serif; background: #0f172a; color: #ef4444; text-align: center; padding: 50px;">
          <h1>404 - Güncellenecek Kullanıcı Bulunamadı</h1>
          <a href="/users" style="color: #6366f1;">Listeye Dön</a>
        </body>
        </html>
      `);
    }

    const htmlView = UserViews.renderUserUpdatedPage(updatedUser);
    res.send(htmlView);
  },

  /**
   * 6. DELETE (POST /users/:id/delete & DELETE /users/:id)
   */
  deleteUser(req, res) {
    const userId = parseInt(req.params.id, 10);
    const deletedUser = UserModel.delete(userId);

    if (!deletedUser) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="tr">
        <body style="font-family: sans-serif; background: #0f172a; color: #ef4444; text-align: center; padding: 50px;">
          <h1>404 - Silinecek Kullanıcı Bulunamadı</h1>
          <a href="/users" style="color: #6366f1;">Listeye Dön</a>
        </body>
        </html>
      `);
    }

    const htmlView = UserViews.renderUserDeletedPage(deletedUser);
    res.send(htmlView);
  },

  /**
   * GET /home
   */
  renderHome(req, res) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Temporary Main Page</title>
        <style>
          body { font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #1e1e2f; color: #fff; }
          .container { text-align: center; background: #2a2a40; padding: 3rem 5rem; border-radius: 16px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); }
          h1 { margin-bottom: 1rem; color: #6366f1; }
          p { font-size: 1.1rem; color: #cbd5e1; }
          a { color: #38bdf8; text-decoration: none; margin-top: 1rem; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to Alumni System</h1>
          <p>This is a temporary main page.</p>
          <a href="/users">Mezun & Kullanıcı Listesini Görüntüle →</a>
        </div>
      </body>
      </html>
    `);
  },

  /**
   * GET /about
   */
  renderAbout(req, res) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>About Us</title>
        <style>
          body { font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #1e1e2f; color: #fff; }
          .container { text-align: center; background: #2a2a40; padding: 3rem 5rem; border-radius: 16px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); max-width: 600px; }
          h1 { margin-bottom: 1rem; color: #10b981; }
          p { font-size: 1.1rem; color: #cbd5e1; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>About Alumni System</h1>
          <p>This platform is designed to connect graduates, foster networking, and share career opportunities.</p>
        </div>
      </body>
      </html>
    `);
  }
};

module.exports = UserController;
