/**
 * UserController - Web Page Controller for User resources
 * Orchestrates request processing and delegates HTML page generation to the View layer (UserViews).
 * Routes:
 *   - GET /users  -> renderUserList (listing view)
 *   - POST /users -> createUser (creating action & view)
 */

const UserModel = require('../models/userModel');
const UserViews = require('../views/userViews');

const UserController = {
  /**
   * GET /users -> listing view
   * Fetch all users from UserModel and render the HTML Listing View.
   */
  renderUserList(req, res) {
    const { sortBy = 'id', order = 'asc' } = req.query;
    const users = UserModel.getAll({ sortBy, order });
    
    // Render Listing View via View Layer
    const htmlView = UserViews.renderUserListPage(users);
    res.send(htmlView);
  },

  /**
   * POST /users -> creating action & view
   * Receive user payload from request body, create user via UserModel, and render creation View.
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

    // Create user entity in Model Layer
    const newUser = UserModel.create(payload);

    // Render Creating Success View via View Layer
    const htmlView = UserViews.renderUserCreatedPage(newUser);
    res.send(htmlView);
  },

  /**
   * GET /users/:id
   * Render single user detail HTML page.
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

    res.send(`
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>Kullanıcı Detayı - ${user.name || user.id}</title>
        <style>
          body { font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 3rem; }
          .card { max-width: 500px; margin: 0 auto; background: #1e293b; padding: 2rem; border-radius: 12px; border: 1px solid #334155; }
          h2 { color: #38bdf8; margin-top: 0; }
          a { color: #6366f1; text-decoration: none; display: inline-block; margin-top: 1rem; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>👤 ${user.name || 'Kullanıcı #' + user.id}</h2>
          <p><strong>ID:</strong> ${user.id}</p>
          <p><strong>E-posta:</strong> ${user.email || 'Belirtilmemiş'}</p>
          <p><strong>Rol:</strong> ${user.role || 'Alumni'}</p>
          <p><strong>Kayıt Tarihi:</strong> ${user.createdAt}</p>
          <a href="/users">← Listeye Dön</a>
        </div>
      </body>
      </html>
    `);
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
  },

  /**
   * PUT /users/:id
   */
  updateUser(req, res) {
    const userId = parseInt(req.params.id, 10);
    const updatedUser = UserModel.update(userId, req.body);
    if (!updatedUser) {
      return res.status(404).send('Güncellenecek kullanıcı bulunamadı.');
    }
    res.redirect(`/users/${userId}`);
  },

  /**
   * DELETE /users/:id
   */
  deleteUser(req, res) {
    const userId = parseInt(req.params.id, 10);
    const deletedUser = UserModel.delete(userId);
    if (!deletedUser) {
      return res.status(404).send('Silinecek kullanıcı bulunamadı.');
    }
    res.redirect('/users');
  }
};

module.exports = UserController;
