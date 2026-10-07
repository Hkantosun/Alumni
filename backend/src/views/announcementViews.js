/**
 * Announcement View Layer - Responsible for generating HTML representations for Announcement Web Pages.
 * Full CRUD View Templates:
 *   1. Listing View (GET /announcements -> Read All)
 *   2. Detail View (GET /announcements/:id -> Read One)
 *   3. Edit Form View (GET /announcements/:id/edit -> Update Form)
 *   4. Created View (POST /announcements -> Create Response)
 *   5. Updated View (POST /announcements/:id/update -> Update Response)
 *   6. Deleted View (POST /announcements/:id/delete -> Delete Response)
 */

const AnnouncementViews = {
  /**
   * 1. READ ALL - Render Announcement Listing HTML View (GET /announcements)
   */
  renderAnnouncementListPage(announcements) {
    const rows = announcements.length > 0
      ? announcements.map(a => `
          <tr>
            <td><span class="id-badge">#${a.id}</span></td>
            <td>
              <strong>${a.title || '-'}</strong>
              ${a.isPinned ? '<span class="pinned-badge">📌 Sabitlendi</span>' : ''}
            </td>
            <td><span class="category-badge">${a.category || 'Genel'}</span></td>
            <td>${a.author || 'Sistem Yöneticisi'}</td>
            <td>${new Date(a.createdAt).toLocaleDateString('tr-TR')}</td>
            <td class="action-cells">
              <a href="/announcements/${a.id}" class="btn btn-view">👁️ Detay</a>
              <a href="/announcements/${a.id}/edit" class="btn btn-edit">✏️ Düzenle</a>
              <form action="/announcements/${a.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('Bu duyuruyu silmek istediğinizden emin misiniz?');">
                <button type="submit" class="btn btn-delete">🗑️ Sil</button>
              </form>
            </td>
          </tr>
        `).join('')
      : `<tr><td colspan="6" style="text-align: center; color: #94a3b8; padding: 2rem;">Henüz kayıtlı bir duyuru bulunmamaktadır. Yukarıdaki formu kullanarak ilk duyuruyu ekleyebilirsiniz.</td></tr>`;

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>📢 Duyuru Yönetimi - Alumni System</title>
        <style>
          :root {
            --bg: #0f172a;
            --card-bg: #1e293b;
            --accent: #38bdf8;
            --accent-hover: #0284c7;
            --text: #f8fafc;
            --muted: #94a3b8;
            --border: #334155;
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
          }
          body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: var(--bg); color: var(--text); margin: 0; padding: 2rem; }
          .container { max-width: 1050px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
          .nav-links { display: flex; gap: 1rem; margin-bottom: 2rem; background: var(--card-bg); padding: 0.75rem 1.25rem; border-radius: 8px; border: 1px solid var(--border); }
          .nav-links a { color: var(--muted); text-decoration: none; font-weight: 600; font-size: 0.95rem; transition: color 0.2s; }
          .nav-links a:hover, .nav-links a.active { color: var(--accent); }
          h1 { color: #38bdf8; margin: 0; font-size: 1.8rem; }
          .card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
          .card h2 { margin-top: 0; color: #818cf8; font-size: 1.25rem; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem; }
          .form-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
          .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
          .full-width { grid-column: span 3; }
          label { font-size: 0.85rem; color: var(--muted); font-weight: 600; }
          input, select, textarea { background: #0f172a; border: 1px solid var(--border); color: var(--text); padding: 0.65rem 0.8rem; border-radius: 6px; font-size: 0.95rem; font-family: inherit; }
          textarea { resize: vertical; min-height: 80px; }
          input:focus, select:focus, textarea:focus { outline: none; border-color: var(--accent); }
          .checkbox-group { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; }
          .checkbox-group input { width: auto; cursor: pointer; }
          .btn { display: inline-flex; align-items: center; justify-content: center; gap: 4px; padding: 0.55rem 1rem; border-radius: 6px; font-weight: 600; font-size: 0.85rem; text-decoration: none; border: none; cursor: pointer; transition: all 0.2s; }
          .btn-primary { background: var(--accent); color: #0f172a; }
          .btn-primary:hover { background: var(--accent-hover); color: white; }
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
          .category-badge { background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 2px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; }
          .pinned-badge { background: rgba(245, 158, 11, 0.2); color: #fbbf24; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px; margin-left: 8px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📢 Alumni Duyuru Sistemi</h1>
            <span style="color: var(--muted);">Web MVC Announcement Model</span>
          </div>

          <div class="nav-links">
            <a href="/home">🏠 Ana Sayfa</a>
            <a href="/users">👥 Mezunlar & Kullanıcılar</a>
            <a href="/announcements" class="active">📢 Duyurular</a>
            <a href="/api/swagger" target="_blank">📚 Swagger API Dokümanı</a>
          </div>

          <!-- CREATE FORM (POST /announcements) -->
          <div class="card">
            <h2>➕ Yeni Duyuru Yayınla (Create Announcement)</h2>
            <form action="/announcements" method="POST">
              <div class="form-grid">
                <div class="form-group">
                  <label for="title">Duyuru Başlığı</label>
                  <input type="text" id="title" name="title" placeholder="ör. 2026 Mezunlar Buluşması Kayıtları Başladı" required>
                </div>
                <div class="form-group">
                  <label for="category">Kategori</label>
                  <select id="category" name="category">
                    <option value="Genel">Genel</option>
                    <option value="Etkinlik">Etkinlik</option>
                    <option value="Kariyer & İş">Kariyer & İş</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Burs & Destek">Burs & Destek</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="author">Yayınlayan</label>
                  <input type="text" id="author" name="author" placeholder="ör. Mezunlar Derneği">
                </div>
                <div class="form-group full-width">
                  <label for="content">Duyuru İçeriği</label>
                  <textarea id="content" name="content" placeholder="Duyuru detaylarını buraya yazınız..." required></textarea>
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div class="checkbox-group">
                  <input type="checkbox" id="isPinned" name="isPinned" value="true">
                  <label for="isPinned" style="cursor: pointer; color: #fbbf24;">📌 Bu duyuruyu başa sabitle</label>
                </div>
                <button type="submit" class="btn btn-primary">📢 Duyuru Ekle</button>
              </div>
            </form>
          </div>

          <!-- LISTING TABLE (GET /announcements) -->
          <div class="card">
            <h2>📋 Yayındaki Duyurular (${announcements.length} Duyuru)</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Başlık</th>
                  <th>Kategori</th>
                  <th>Yayınlayan</th>
                  <th>Tarih</th>
                  <th>İşlemler (CRUD)</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>
        </div>
      </body>
      </html>
    `;
  },

  /**
   * 2. READ ONE - Render Announcement Detail HTML View (GET /announcements/:id)
   */
  renderAnnouncementDetailPage(announcement) {
    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Duyuru Detayı - ${announcement.title}</title>
        <style>
          body { font-family: 'Inter', system-ui, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 3rem; margin: 0; }
          .card { max-width: 650px; margin: 0 auto; background: #1e293b; padding: 2.5rem; border-radius: 12px; border: 1px solid #334155; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          h2 { color: #38bdf8; margin-top: 0; font-size: 1.6rem; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #334155; padding-bottom: 1rem; }
          .meta-info { display: flex; gap: 1.5rem; font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.5rem; }
          .content-box { background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 1.25rem; font-size: 1rem; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap; margin-bottom: 2rem; }
          .btn-group { display: flex; gap: 10px; }
          a, button { text-decoration: none; padding: 0.65rem 1.2rem; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; font-size: 0.9rem; }
          .btn-back { background: #334155; color: white; }
          .btn-edit { background: #f59e0b; color: white; }
          .btn-delete { background: #ef4444; color: white; }
          .category-badge { background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 2px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>📢 ${announcement.title}</h2>
          <div class="meta-info">
            <span>🏷️ <span class="category-badge">${announcement.category || 'Genel'}</span></span>
            <span>👤 ${announcement.author || 'Sistem Yöneticisi'}</span>
            <span>📅 ${new Date(announcement.createdAt).toLocaleString('tr-TR')}</span>
          </div>
          <div class="content-box">${announcement.content}</div>
          <div class="btn-group">
            <a href="/announcements" class="btn-back">← Duyurulara Dön</a>
            <a href="/announcements/${announcement.id}/edit" class="btn-edit">✏️ Düzenle</a>
            <form action="/announcements/${announcement.id}/delete" method="POST" style="margin:0;" onsubmit="return confirm('Bu duyuruyu silmek istediğinizden emin misiniz?');">
              <button type="submit" class="btn-delete">🗑️ Sil</button>
            </form>
          </div>
        </div>
      </body>
      </html>
    `;
  },

  /**
   * 3. UPDATE FORM - Render Edit Announcement HTML Form View (GET /announcements/:id/edit)
   */
  renderAnnouncementEditPage(announcement) {
    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Duyuru Düzenle - ${announcement.title}</title>
        <style>
          body { font-family: 'Inter', system-ui, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 3rem; margin: 0; }
          .card { max-width: 600px; margin: 0 auto; background: #1e293b; padding: 2.5rem; border-radius: 12px; border: 1px solid #334155; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          h2 { color: #f59e0b; margin-top: 0; font-size: 1.5rem; }
          .form-group { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.2rem; }
          label { font-size: 0.85rem; color: #94a3b8; font-weight: 600; }
          input, select, textarea { background: #0f172a; border: 1px solid #334155; color: #f8fafc; padding: 0.7rem; border-radius: 6px; font-size: 1rem; font-family: inherit; }
          textarea { resize: vertical; min-height: 100px; }
          input:focus, select:focus, textarea:focus { outline: none; border-color: #f59e0b; }
          .checkbox-group { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; }
          .checkbox-group input { width: auto; cursor: pointer; }
          .btn-group { display: flex; gap: 10px; margin-top: 1.5rem; }
          button, a { padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 600; text-decoration: none; border: none; cursor: pointer; text-align: center; }
          .btn-save { background: #f59e0b; color: white; }
          .btn-cancel { background: #334155; color: white; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>✏️ Duyuruyu Düzenle (#${announcement.id})</h2>
          <form action="/announcements/${announcement.id}/update" method="POST">
            <div class="form-group">
              <label for="title">Duyuru Başlığı</label>
              <input type="text" id="title" name="title" value="${announcement.title || ''}" required>
            </div>
            <div class="form-group">
              <label for="category">Kategori</label>
              <select id="category" name="category">
                <option value="Genel" ${announcement.category === 'Genel' ? 'selected' : ''}>Genel</option>
                <option value="Etkinlik" ${announcement.category === 'Etkinlik' ? 'selected' : ''}>Etkinlik</option>
                <option value="Kariyer & İş" ${announcement.category === 'Kariyer & İş' ? 'selected' : ''}>Kariyer & İş</option>
                <option value="Akademik" ${announcement.category === 'Akademik' ? 'selected' : ''}>Akademik</option>
                <option value="Burs & Destek" ${announcement.category === 'Burs & Destek' ? 'selected' : ''}>Burs & Destek</option>
              </select>
            </div>
            <div class="form-group">
              <label for="author">Yayınlayan</label>
              <input type="text" id="author" name="author" value="${announcement.author || ''}">
            </div>
            <div class="form-group">
              <label for="content">Duyuru İçeriği</label>
              <textarea id="content" name="content" required>${announcement.content || ''}</textarea>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="isPinned" name="isPinned" value="true" ${announcement.isPinned ? 'checked' : ''}>
              <label for="isPinned" style="cursor: pointer; color: #fbbf24;">📌 Bu duyuruyu başa sabitle</label>
            </div>
            <div class="btn-group">
              <button type="submit" class="btn-save">Değişiklikleri Kaydet</button>
              <a href="/announcements" class="btn-cancel">İptal</a>
            </div>
          </form>
        </div>
      </body>
      </html>
    `;
  },

  /**
   * 4. CREATE RESPONSE - Render Created View (POST /announcements)
   */
  renderAnnouncementCreatedPage(newAnnouncement) {
    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>Duyuru Yayınlandı</title>
        <style>
          body { font-family: 'Inter', system-ui, sans-serif; background-color: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          .card { background: #1e293b; border: 1px solid #334155; padding: 2.5rem; border-radius: 12px; text-align: center; max-width: 480px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .icon { font-size: 3rem; margin-bottom: 1rem; }
          h2 { color: #38bdf8; margin-top: 0; }
          p { color: #cbd5e1; margin-bottom: 1.5rem; }
          a { background: #6366f1; color: white; text-decoration: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 600; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">📢</div>
          <h2>Duyuru Başarıyla Yayınlandı!</h2>
          <p><strong>"${newAnnouncement.title}"</strong> duyurusu listeye eklendi.</p>
          <a href="/announcements">Duyuru Listesine Dön</a>
        </div>
      </body>
      </html>
    `;
  },

  /**
   * 5. UPDATE RESPONSE - Render Updated View (POST /announcements/:id/update)
   */
  renderAnnouncementUpdatedPage(updatedAnnouncement) {
    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>Duyuru Güncellendi</title>
        <style>
          body { font-family: 'Inter', system-ui, sans-serif; background-color: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          .card { background: #1e293b; border: 1px solid #334155; padding: 2.5rem; border-radius: 12px; text-align: center; max-width: 480px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .icon { font-size: 3rem; margin-bottom: 1rem; }
          h2 { color: #f59e0b; margin-top: 0; }
          p { color: #cbd5e1; margin-bottom: 1.5rem; }
          a { background: #6366f1; color: white; text-decoration: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 600; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">✏️</div>
          <h2>Duyuru Güncellendi!</h2>
          <p><strong>"${updatedAnnouncement.title}"</strong> duyurusu güncellendi.</p>
          <a href="/announcements">Duyuru Listesine Dön</a>
        </div>
      </body>
      </html>
    `;
  },

  /**
   * 6. DELETE RESPONSE - Render Deleted View (POST /announcements/:id/delete)
   */
  renderAnnouncementDeletedPage(deletedAnnouncement) {
    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>Duyuru Silindi</title>
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
          <h2>Duyuru Silindi!</h2>
          <p>ID'si #${deletedAnnouncement.id} olan <strong>"${deletedAnnouncement.title}"</strong> duyurusu sistemden kaldırıldı.</p>
          <a href="/announcements">Duyuru Listesine Dön</a>
        </div>
      </body>
      </html>
    `;
  }
};

module.exports = AnnouncementViews;
