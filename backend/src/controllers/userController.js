/**
 * UserController - Web Page / View Controller for User resources
 * Handles HTML views, page rendering, web actions, and CRUD responses for user pages.
 */

const UserModel = require('../models/userModel');

const UserController = {
  /**
   * GET /users (or /users/list)
   * Render HTML page listing all users/alumni.
   */
  renderUserList(req, res) {
    const { sortBy = 'id', order = 'asc' } = req.query;
    const users = UserModel.getAll({ sortBy, order });

    const rowsHtml = users.length > 0
      ? users.map(u => `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #334155;">${u.id}</td>
            <td style="padding: 12px; border-bottom: 1px solid #334155;">${u.name || '-'}</td>
            <td style="padding: 12px; border-bottom: 1px solid #334155;">${u.email || '-'}</td>
            <td style="padding: 12px; border-bottom: 1px solid #334155;">${u.department || u.role || 'Alumni'}</td>
            <td style="padding: 12px; border-bottom: 1px solid #334155;">${new Date(u.createdAt).toLocaleDateString()}</td>
          </tr>
        `).join('')
      : `<tr><td colspan="5" style="padding: 20px; text-align: center; color: #94a3b8;">Henüz kayıtlı kullanıcı bulunmamaktadır.</td></tr>`;

    res.send(`
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Alumni Kullanıcı Listesi</title>
        <style>
          body { font-family: 'Inter', system-ui, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 2rem; }
          .container { max-width: 900px; margin: 0 auto; background: #1e293b; padding: 2rem; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          h1 { color: #6366f1; margin-top: 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; text-align: left; }
          th { background: #334155; padding: 12px; color: #cbd5e1; }
          .badge { background: #4f46e5; color: white; padding: 4px 10px; border-radius: 9999px; font-size: 0.85rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎓 Mezun & Kullanıcı Listesi <span class="badge">${users.length} Kayıt</span></h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Ad Soyad</th>
                <th>E-posta</th>
                <th>Rol / Bölüm</th>
                <th>Kayıt Tarihi</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `);
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
        </style>
      </head>
      <body>
        <div class="card">
          <h2>👤 ${user.name || 'Kullanıcı #' + user.id}</h2>
          <p><strong>ID:</strong> ${user.id}</p>
          <p><strong>E-posta:</strong> ${user.email || 'Belirtilmemiş'}</p>
          <p><strong>Kayıt Tarihi:</strong> ${user.createdAt}</p>
        </div>
      </body>
      </html>
    `);
  },

  /**
   * GET /home
   * Render Temporary Main Page
   */
  renderHome(req, res) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Temporary Main Page</title>
        <style>
          body { font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #1e1e2f; color: #fff; }
          .container { text-align: center; background: #2a2a40; padding: 3rem 5rem; border-radius: 16px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); }
          h1 { margin-bottom: 1rem; color: #6366f1; }
          p { font-size: 1.1rem; color: #cbd5e1; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to Alumni System</h1>
          <p>This is a temporary main page.</p>
        </div>
      </body>
      </html>
    `);
  },

  /**
   * GET /about
   * Render About Page
   */
  renderAbout(req, res) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
          <p>This platform is designed to connect graduates, foster networking, and share career opportunities. Stay tuned for more features!</p>
        </div>
      </body>
      </html>
    `);
  },

  /**
   * Web CRUD Action: Create User
   */
  createUser(req, res) {
    const payload = req.body;
    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).send('Form verisi boş olamaz.');
    }
    const newUser = UserModel.create(payload);
    res.redirect(`/users/${newUser.id}`);
  },

  /**
   * Web CRUD Action: Update User
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
   * Web CRUD Action: Delete User
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
