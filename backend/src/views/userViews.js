/**
 * User View Layer - Responsible for generating HTML representations for User pages.
 * Handles:
 *   1. Listing View (GET /users -> listing)
 *   2. Creating View / Response (POST /users -> creating)
 */

const UserViews = {
  /**
   * Render User Listing HTML View (GET /users -> listing)
   * Includes an interactive HTML form for creating new users (POST /users -> creating)
   * @param {Array} users - Array of user objects
   * @returns {string} Complete HTML markup string
   */
  renderUserListPage(users) {
    const userRows = users.length > 0
      ? users.map(u => `
          <tr>
            <td><span class="id-badge">#${u.id}</span></td>
            <td><strong>${u.name || '-'}</strong></td>
            <td>${u.email || '-'}</td>
            <td><span class="role-badge">${u.role || u.department || 'Alumni'}</span></td>
            <td>${new Date(u.createdAt).toLocaleDateString('tr-TR')}</td>
          </tr>
        `).join('')
      : `<tr><td colspan="5" style="text-align: center; color: #94a3b8; padding: 2rem;">Henüz kullanıcı bulunmamaktadır. Aşağıdaki formu kullanarak yeni bir kullanıcı oluşturabilirsiniz.</td></tr>`;

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🎓 Alumni Tracking System - Mezun & Kullanıcı Listesi</title>
        <style>
          :root {
            --bg: #0f172a;
            --card-bg: #1e293b;
            --accent: #6366f1;
            --accent-hover: #4f46e5;
            --text: #f8fafc;
            --muted: #94a3b8;
            --border: #334155;
          }
          body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: var(--bg); color: var(--text); margin: 0; padding: 2rem; }
          .container { max-width: 960px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
          h1 { color: #818cf8; margin: 0; font-size: 1.8rem; display: flex; align-items: center; gap: 0.5rem; }
          .card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
          .card h2 { margin-top: 0; color: #38bdf8; font-size: 1.25rem; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem; }
          .form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 1rem; align-items: end; }
          .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
          label { font-size: 0.85rem; color: var(--muted); font-weight: 600; }
          input, select { background: #0f172a; border: 1px solid var(--border); color: var(--text); padding: 0.6rem 0.8rem; border-radius: 6px; font-size: 0.95rem; }
          input:focus, select:focus { outline: none; border-color: var(--accent); }
          button { background: var(--accent); color: white; border: none; padding: 0.65rem 1.2rem; border-radius: 6px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
          button:hover { background: var(--accent-hover); }
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; text-align: left; }
          th { background: #111827; padding: 12px; color: var(--muted); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--border); }
          td { padding: 12px; border-bottom: 1px solid var(--border); font-size: 0.95rem; }
          .id-badge { background: #334155; padding: 2px 8px; border-radius: 4px; font-family: monospace; font-size: 0.85rem; }
          .role-badge { background: rgba(99, 102, 241, 0.2); color: #a5b4fc; border: 1px solid rgba(99, 102, 241, 0.4); padding: 2px 10px; border-radius: 9999px; font-size: 0.8rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Alumni Tracking System</h1>
            <span style="color: var(--muted);">Web View Layer (HTML)</span>
          </div>

          <!-- CREATE USER FORM (POST /users -> creating) -->
          <div class="card">
            <h2>➕ Yeni Kullanıcı Oluştur (Creating View)</h2>
            <form action="/users" method="POST" class="form-grid">
              <div class="form-group">
                <label for="name">Ad Soyad</label>
                <input type="text" id="name" name="name" placeholder="ör. Ahmet Yılmaz" required>
              </div>
              <div class="form-group">
                <label for="email">E-posta</label>
                <input type="email" id="email" name="email" placeholder="ör. ahmet@example.com" required>
              </div>
              <div class="form-group">
                <label for="role">Rol / Durum</label>
                <select id="role" name="role">
                  <option value="Alumni">Mezun (Alumni)</option>
                  <option value="Student">Öğrenci (Student)</option>
                  <option value="Academic Staff">Akademik Personel</option>
                </select>
              </div>
              <button type="submit">Kullanıcı Ekle</button>
            </form>
          </div>

          <!-- USER LIST TABLE (GET /users -> listing) -->
          <div class="card">
            <h2>📋 Mezun & Kullanıcı Listesi (Listing View - ${users.length} Kayıt)</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ad Soyad</th>
                  <th>E-posta</th>
                  <th>Rol</th>
                  <th>Kayıt Tarihi</th>
                </tr>
              </thead>
              <tbody>
                ${userRows}
              </tbody>
            </table>
          </div>
        </div>
      </body>
      </html>
    `;
  },

  /**
   * Render User Created Confirmation View (POST /users -> creating)
   * @param {Object} newUser - Newly created user entity
   * @returns {string} Complete HTML markup string
   */
  renderUserCreatedPage(newUser) {
    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kullanıcı Başarıyla Oluşturuldu</title>
        <style>
          body { font-family: 'Inter', system-ui, sans-serif; background-color: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          .card { background: #1e293b; border: 1px solid #334155; padding: 2.5rem; border-radius: 12px; text-align: center; max-width: 450px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .icon { font-size: 3rem; margin-bottom: 1rem; }
          h2 { color: #10b981; margin-top: 0; }
          p { color: #cbd5e1; margin-bottom: 1.5rem; line-height: 1.5; }
          a { background: #6366f1; color: white; text-decoration: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 600; display: inline-block; transition: background 0.2s; }
          a:hover { background: #4f46e5; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">✅</div>
          <h2>Kullanıcı Başarıyla Oluşturuldu!</h2>
          <p><strong>${newUser.name}</strong> (${newUser.email}) sisteme eklenmiştir.</p>
          <a href="/users">Mezun & Kullanıcı Listesine Git</a>
        </div>
      </body>
      </html>
    `;
  }
};

module.exports = UserViews;
