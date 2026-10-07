/**
 * User View Layer - Responsible for generating HTML representations for User Web Pages.
 * Full CRUD View Templates:
 *   1. Listing View (GET /users -> Read All)
 *   2. Detail View (GET /users/:id -> Read One)
 *   3. Edit Form View (GET /users/:id/edit -> Update Form)
 *   4. Created View (POST /users -> Create Response)
 *   5. Updated View (POST /users/:id/update -> Update Response)
 *   6. Deleted View (POST /users/:id/delete -> Delete Response)
 */

const UserViews = {
  /**
   * 1. READ ALL - Render User Listing HTML View (GET /users)
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
            <td class="action-cells">
              <a href="/users/${u.id}" class="btn btn-view">👁️ Detay</a>
              <a href="/users/${u.id}/edit" class="btn btn-edit">✏️ Düzenle</a>
              <form action="/users/${u.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?');">
                <button type="submit" class="btn btn-delete">🗑️ Sil</button>
              </form>
            </td>
          </tr>
        `).join('')
      : `<tr><td colspan="6" style="text-align: center; color: #94a3b8; padding: 2rem;">Henüz kullanıcı bulunmamaktadır. Aşağıdaki formu kullanarak yeni bir kullanıcı oluşturabilirsiniz.</td></tr>`;

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🎓 Alumni System - Kullanıcı CRUD Yönetimi</title>
        <style>
          :root {
            --bg: #0f172a;
            --card-bg: #1e293b;
            --accent: #6366f1;
            --accent-hover: #4f46e5;
            --text: #f8fafc;
            --muted: #94a3b8;
            --border: #334155;
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
          }
          body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: var(--bg); color: var(--text); margin: 0; padding: 2rem; }
          .container { max-width: 1000px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
          h1 { color: #818cf8; margin: 0; font-size: 1.8rem; }
          .card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
          .card h2 { margin-top: 0; color: #38bdf8; font-size: 1.25rem; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem; }
          .form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 1rem; align-items: end; }
          .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
          label { font-size: 0.85rem; color: var(--muted); font-weight: 600; }
          input, select { background: #0f172a; border: 1px solid var(--border); color: var(--text); padding: 0.65rem 0.8rem; border-radius: 6px; font-size: 0.95rem; }
          input:focus, select:focus { outline: none; border-color: var(--accent); }
          .btn { display: inline-flex; align-items: center; justify-content: center; gap: 4px; padding: 0.5rem 0.9rem; border-radius: 6px; font-weight: 600; font-size: 0.85rem; text-decoration: none; border: none; cursor: pointer; transition: all 0.2s; }
          .btn-primary { background: var(--accent); color: white; }
          .btn-primary:hover { background: var(--accent-hover); }
          .btn-view { background: #334155; color: #38bdf8; }
          .btn-view:hover { background: #475569; }
          .btn-edit { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
          .btn-edit:hover { background: rgba(245, 158, 11, 0.3); }
          .btn-delete { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
          .btn-delete:hover { background: rgba(239, 68, 68, 0.3); }
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; text-align: left; }
          th { background: #111827; padding: 12px; color: var(--muted); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--border); }
          td { padding: 12px; border-bottom: 1px solid var(--border); font-size: 0.95rem; }
          .action-cells { display: flex; gap: 6px; align-items: center; }
          .id-badge { background: #334155; padding: 2px 8px; border-radius: 4px; font-family: monospace; font-size: 0.85rem; }
          .role-badge { background: rgba(99, 102, 241, 0.2); color: #a5b4fc; border: 1px solid rgba(99, 102, 241, 0.4); padding: 2px 10px; border-radius: 9999px; font-size: 0.8rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Alumni Tracking System</h1>
            <span style="color: var(--muted);">Web MVC CRUD View</span>
          </div>

          <div style="display: flex; gap: 1rem; margin-bottom: 2rem; background: var(--card-bg); padding: 0.75rem 1.25rem; border-radius: 8px; border: 1px solid var(--border);">
            <a href="/home" style="color: var(--muted); text-decoration: none; font-weight: 600;">🏠 Ana Sayfa</a>
            <a href="/users" style="color: var(--accent); text-decoration: none; font-weight: 600;">👥 Mezunlar & Kullanıcılar</a>
            <a href="/announcements" style="color: var(--muted); text-decoration: none; font-weight: 600;">📢 Duyurular</a>
            <a href="/api/swagger" target="_blank" style="color: var(--muted); text-decoration: none; font-weight: 600;">📚 Swagger API Dokümanı</a>
          </div>

          <!-- CREATE FORM (POST /users) -->
          <div class="card">
            <h2>➕ Yeni Kullanıcı Oluştur (Create Action)</h2>
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
              <button type="submit" class="btn btn-primary">Kullanıcı Ekle</button>
            </form>
          </div>

          <!-- LISTING TABLE (GET /users) -->
          <div class="card">
            <h2>📋 Mezun & Kullanıcı Listesi (Read All - ${users.length} Kayıt)</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ad Soyad</th>
                  <th>E-posta</th>
                  <th>Rol</th>
                  <th>Kayıt Tarihi</th>
                  <th>İşlemler (CRUD)</th>
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
   * 2. READ ONE - Render User Detail HTML View (GET /users/:id)
   */
  renderUserDetailPage(user) {
    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kullanıcı Detayı - ${user.name}</title>
        <style>
          body { font-family: 'Inter', system-ui, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 3rem; margin: 0; }
          .card { max-width: 550px; margin: 0 auto; background: #1e293b; padding: 2.5rem; border-radius: 12px; border: 1px solid #334155; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          h2 { color: #38bdf8; margin-top: 0; font-size: 1.5rem; display: flex; align-items: center; gap: 8px; }
          .info-group { margin: 1.2rem 0; padding-bottom: 0.8rem; border-bottom: 1px solid #334155; }
          .label { font-size: 0.85rem; color: #94a3b8; font-weight: 600; }
          .val { font-size: 1.1rem; color: #f8fafc; margin-top: 4px; }
          .btn-group { display: flex; gap: 10px; margin-top: 2rem; }
          a, button { text-decoration: none; padding: 0.65rem 1.2rem; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; font-size: 0.9rem; }
          .btn-back { background: #334155; color: white; }
          .btn-edit { background: #f59e0b; color: white; }
          .btn-delete { background: #ef4444; color: white; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>👤 ${user.name || 'Kullanıcı #' + user.id}</h2>
          <div class="info-group">
            <div class="label">KULLANICI ID</div>
            <div class="val">#${user.id}</div>
          </div>
          <div class="info-group">
            <div class="label">E-POSTA ADRESİ</div>
            <div class="val">${user.email || 'Belirtilmemiş'}</div>
          </div>
          <div class="info-group">
            <div class="label">ROL / BÖLÜM</div>
            <div class="val">${user.role || user.department || 'Alumni'}</div>
          </div>
          <div class="info-group">
            <div class="label">KAYIT TARİHİ</div>
            <div class="val">${new Date(user.createdAt).toLocaleString('tr-TR')}</div>
          </div>
          ${user.updatedAt ? `
          <div class="info-group">
            <div class="label">SON GÜNCELLEME</div>
            <div class="val">${new Date(user.updatedAt).toLocaleString('tr-TR')}</div>
          </div>
          ` : ''}
          <div class="btn-group">
            <a href="/users" class="btn-back">← Listeye Dön</a>
            <a href="/users/${user.id}/edit" class="btn-edit">✏️ Düzenle</a>
            <form action="/users/${user.id}/delete" method="POST" style="margin:0;" onsubmit="return confirm('Silmek istediğinizden emin misiniz?');">
              <button type="submit" class="btn-delete">🗑️ Sil</button>
            </form>
          </div>
        </div>
      </body>
      </html>
    `;
  },

  /**
   * 3. UPDATE FORM - Render Edit User HTML Form View (GET /users/:id/edit)
   */
  renderUserEditPage(user) {
    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kullanıcı Düzenle - ${user.name}</title>
        <style>
          body { font-family: 'Inter', system-ui, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 3rem; margin: 0; }
          .card { max-width: 500px; margin: 0 auto; background: #1e293b; padding: 2.5rem; border-radius: 12px; border: 1px solid #334155; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          h2 { color: #f59e0b; margin-top: 0; font-size: 1.5rem; }
          .form-group { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.2rem; }
          label { font-size: 0.85rem; color: #94a3b8; font-weight: 600; }
          input, select { background: #0f172a; border: 1px solid #334155; color: #f8fafc; padding: 0.7rem; border-radius: 6px; font-size: 1rem; }
          input:focus, select:focus { outline: none; border-color: #f59e0b; }
          .btn-group { display: flex; gap: 10px; margin-top: 1.5rem; }
          button, a { padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 600; text-decoration: none; border: none; cursor: pointer; text-align: center; }
          .btn-save { background: #f59e0b; color: white; }
          .btn-cancel { background: #334155; color: white; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>✏️ Kullanıcı Düzenle (#${user.id})</h2>
          <form action="/users/${user.id}/update" method="POST">
            <div class="form-group">
              <label for="name">Ad Soyad</label>
              <input type="text" id="name" name="name" value="${user.name || ''}" required>
            </div>
            <div class="form-group">
              <label for="email">E-posta Adresi</label>
              <input type="email" id="email" name="email" value="${user.email || ''}" required>
            </div>
            <div class="form-group">
              <label for="role">Rol / Durum</label>
              <select id="role" name="role">
                <option value="Alumni" ${user.role === 'Alumni' ? 'selected' : ''}>Mezun (Alumni)</option>
                <option value="Student" ${user.role === 'Student' ? 'selected' : ''}>Öğrenci (Student)</option>
                <option value="Academic Staff" ${user.role === 'Academic Staff' ? 'selected' : ''}>Akademik Personel</option>
              </select>
            </div>
            <div class="btn-group">
              <button type="submit" class="btn-save">Değişiklikleri Kaydet</button>
              <a href="/users" class="btn-cancel">İptal</a>
            </div>
          </form>
        </div>
      </body>
      </html>
    `;
  },

  /**
   * 4. CREATE RESPONSE - Render Created View (POST /users)
   */
  renderUserCreatedPage(newUser) {
    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>Kullanıcı Oluşturuldu</title>
        <style>
          body { font-family: 'Inter', system-ui, sans-serif; background-color: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          .card { background: #1e293b; border: 1px solid #334155; padding: 2.5rem; border-radius: 12px; text-align: center; max-width: 450px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .icon { font-size: 3rem; margin-bottom: 1rem; }
          h2 { color: #10b981; margin-top: 0; }
          p { color: #cbd5e1; margin-bottom: 1.5rem; }
          a { background: #6366f1; color: white; text-decoration: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 600; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">✅</div>
          <h2>Kullanıcı Başarıyla Oluşturuldu!</h2>
          <p><strong>${newUser.name}</strong> (${newUser.email}) sisteme eklendi.</p>
          <a href="/users">Mezun Listesine Dön</a>
        </div>
      </body>
      </html>
    `;
  },

  /**
   * 5. UPDATE RESPONSE - Render Updated View (POST /users/:id/update)
   */
  renderUserUpdatedPage(updatedUser) {
    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>Kullanıcı Güncellendi</title>
        <style>
          body { font-family: 'Inter', system-ui, sans-serif; background-color: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          .card { background: #1e293b; border: 1px solid #334155; padding: 2.5rem; border-radius: 12px; text-align: center; max-width: 450px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .icon { font-size: 3rem; margin-bottom: 1rem; }
          h2 { color: #f59e0b; margin-top: 0; }
          p { color: #cbd5e1; margin-bottom: 1.5rem; }
          a { background: #6366f1; color: white; text-decoration: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 600; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">✏️</div>
          <h2>Kullanıcı Bilgileri Güncellendi!</h2>
          <p><strong>${updatedUser.name}</strong> bilgileri başarıyla kaydedildi.</p>
          <a href="/users">Mezun Listesine Dön</a>
        </div>
      </body>
      </html>
    `;
  },

  /**
   * 6. DELETE RESPONSE - Render Deleted View (POST /users/:id/delete)
   */
  renderUserDeletedPage(deletedUser) {
    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>Kullanıcı Silindi</title>
        <style>
          body { font-family: 'Inter', system-ui, sans-serif; background-color: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          .card { background: #1e293b; border: 1px solid #334155; padding: 2.5rem; border-radius: 12px; text-align: center; max-width: 450px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .icon { font-size: 3rem; margin-bottom: 1rem; }
          h2 { color: #ef4444; margin-top: 0; }
          p { color: #cbd5e1; margin-bottom: 1.5rem; }
          a { background: #6366f1; color: white; text-decoration: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 600; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">🗑️</div>
          <h2>Kullanıcı Silindi!</h2>
          <p>ID'si #${deletedUser.id} olan <strong>${deletedUser.name}</strong> kaydı sistemden kaldırıldı.</p>
          <a href="/users">Mezun Listesine Dön</a>
        </div>
      </body>
      </html>
    `;
  }
};

module.exports = UserViews;
