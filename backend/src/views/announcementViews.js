/**
 * Announcement View Layer - Responsible for generating HTML representations for Announcement Web Pages.
 * Styled consistently with DESIGN.md (Mintlify Design System) via MintlifyTheme.
 * Full CRUD View Templates:
 *   1. Listing View (GET /announcements -> Read All)
 *   2. Detail View (GET /announcements/:id -> Read One)
 *   3. Edit Form View (GET /announcements/:id/edit -> Update Form)
 *   4. Created View (POST /announcements -> Create Response)
 *   5. Updated View (POST /announcements/:id/update -> Update Response)
 *   6. Deleted View (POST /announcements/:id/delete -> Delete Response)
 */

const MintlifyTheme = require('./mintlifyTheme');
const { escapeHtml } = MintlifyTheme;

function renderStatusCard({ title, message, badgeText, badgeClass = 'badge-green' }) {
  return `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${escapeHtml(title)} — İÜ YBS</title>
      <style>
        ${MintlifyTheme.getBaseStyles()}
      </style>
    </head>
    <body>
      ${MintlifyTheme.renderHeader('announcements')}
      <main class="page-main">
        <div class="page-container" style="max-width: 560px; margin-top: 64px;">
          <div class="card-base" style="text-align: center; padding: 36px;">
            <span class="${badgeClass}" style="margin-bottom: 14px;">${escapeHtml(badgeText)}</span>
            <h1 style="font-size: 24px; font-weight: 600; color: var(--ink); margin-bottom: 10px;">${escapeHtml(title)}</h1>
            <p style="font-size: 15px; color: var(--steel); margin-bottom: 24px;">${message}</p>
            <a href="/announcements" class="btn btn-primary">Duyuru Listesine Dön</a>
          </div>
        </div>
      </main>
      ${MintlifyTheme.renderFooter()}
    </body>
    </html>
  `;
}

const AnnouncementViews = {
  /**
   * 1. READ ALL - Render Announcement Listing HTML View (GET /announcements)
   */
  renderAnnouncementListPage(announcements) {
    const pinnedCount = announcements.filter(a => a.isPinned).length;

    const rows = announcements.length > 0
      ? announcements.map(a => `
          <tr>
            <td><span class="code-inline">#${a.id}</span></td>
            <td>
              <strong style="color: var(--ink); font-weight: 600;">${escapeHtml(a.title || '-')}</strong>
              ${a.isPinned ? '<span class="badge-warn" style="margin-left: 8px;">📌 Sabitlendi</span>' : ''}
            </td>
            <td><span class="badge-tag">${escapeHtml(a.category || 'Genel')}</span></td>
            <td style="color: var(--steel);">${escapeHtml(a.author || 'Sistem Yöneticisi')}</td>
            <td style="color: var(--steel); font-size: 13px;">${a.createdAt ? new Date(a.createdAt).toLocaleDateString('tr-TR') : '-'}</td>
            <td class="action-cells">
              <a href="/announcements/${a.id}" class="btn btn-secondary btn-sm">Detay</a>
              <a href="/announcements/${a.id}/edit" class="btn btn-warn btn-sm">Düzenle</a>
              <form action="/announcements/${a.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('Bu duyuruyu silmek istediğinizden emin misiniz?');">
                <button type="submit" class="btn btn-danger btn-sm">Sil</button>
              </form>
            </td>
          </tr>
        `).join('')
      : `<tr><td colspan="6" style="text-align: center; color: var(--steel); padding: 32px;">Henüz kayıtlı bir duyuru bulunmamaktadır. Yukarıdaki formu kullanarak ilk duyuruyu ekleyebilirsiniz.</td></tr>`;

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Duyurular & Etkinlikler — İÜ YBS</title>
        <style>
          ${MintlifyTheme.getBaseStyles()}
          .ann-form-grid {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr;
            gap: 14px;
            margin-bottom: 14px;
          }
          .full-width { grid-column: 1 / -1; }
          .checkbox-group {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .checkbox-group input {
            width: 16px;
            height: 16px;
            accent-color: var(--brand-green-deep);
            cursor: pointer;
          }
          @media (max-width: 820px) {
            .ann-form-grid { grid-template-columns: 1fr; }
          }
        </style>
      </head>
      <body>
        ${MintlifyTheme.renderHeader('announcements')}

        <main class="page-main">
          <div class="page-container">
            <div class="page-header-block">
              <div>
                <span class="section-kicker"><span class="mint-dot"></span> GÜNDEM & ETKİNLİK</span>
                <h1 class="page-title">Duyurular & Etkinlikler</h1>
                <p class="page-subtitle">Bölüm duyurularını, kariyer günlerini ve mezun buluşmalarını yayınlayın ve yönetin.</p>
              </div>
              <a href="/api/announcements" target="_blank" class="btn btn-secondary">JSON API ↗</a>
            </div>

            <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr);">
              <div class="stat-card">
                <div class="stat-label">Toplam Duyuru</div>
                <div class="stat-value"><span class="mint-dot"></span> ${announcements.length}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Sabitlenenler</div>
                <div class="stat-value">${pinnedCount}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">REST Endpoint</div>
                <div class="stat-value" style="font-size: 14px; font-family: var(--font-mono); color: var(--brand-tag);">GET /api/announcements</div>
              </div>
            </div>

            <!-- CREATE FORM (POST /announcements) -->
            <section class="card-feature">
              <div class="card-title-row">
                <h2 class="card-heading">Yeni Duyuru Yayınla</h2>
                <span class="code-inline">POST /announcements</span>
              </div>
              <form action="/announcements" method="POST">
                <div class="ann-form-grid">
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
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;">
                  <div class="checkbox-group">
                    <input type="checkbox" id="isPinned" name="isPinned" value="true">
                    <label for="isPinned" style="cursor: pointer; font-size: 14px; color: var(--charcoal); font-weight: 500;">Bu duyuruyu başa sabitle</label>
                  </div>
                  <button type="submit" class="btn btn-accent-green">Duyuruyu Yayınla</button>
                </div>
              </form>
            </section>

            <!-- LISTING TABLE (GET /announcements) -->
            <section class="card-base">
              <div class="card-title-row">
                <h2 class="card-heading">Yayındaki Duyurular</h2>
                <span class="badge-green">${announcements.length} Duyuru</span>
              </div>
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Başlık</th>
                      <th>Kategori</th>
                      <th>Yayınlayan</th>
                      <th>Tarih</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${rows}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>

        ${MintlifyTheme.renderFooter()}
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
        <title>${escapeHtml(announcement.title)} — İÜ YBS</title>
        <style>
          ${MintlifyTheme.getBaseStyles()}
          .content-box {
            background: var(--surface-soft);
            border: 1px solid var(--hairline);
            border-radius: var(--rounded-md);
            padding: 20px;
            font-size: 15px;
            line-height: 1.65;
            color: var(--charcoal);
            white-space: pre-wrap;
            margin: 20px 0 24px;
          }
        </style>
      </head>
      <body>
        ${MintlifyTheme.renderHeader('announcements')}
        <main class="page-main">
          <div class="page-container" style="max-width: 740px;">
            <div style="margin-bottom: 18px;">
              <a href="/announcements" class="btn btn-secondary btn-sm">← Duyurulara Dön</a>
            </div>

            <div class="card-base">
              <div class="card-title-row">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;">
                    <span class="code-inline">#${announcement.id}</span>
                    <span class="badge-tag">${escapeHtml(announcement.category || 'Genel')}</span>
                    ${announcement.isPinned ? '<span class="badge-warn">📌 Sabitlendi</span>' : ''}
                  </div>
                  <h1 style="font-size: 24px; font-weight: 600; color: var(--ink);">${escapeHtml(announcement.title)}</h1>
                </div>
              </div>

              <div style="display: flex; gap: 18px; font-size: 13px; color: var(--steel); flex-wrap: wrap;">
                <span>Yayınlayan: <strong style="color: var(--ink);">${escapeHtml(announcement.author || 'Sistem Yöneticisi')}</strong></span>
                <span>Tarih: ${announcement.createdAt ? new Date(announcement.createdAt).toLocaleString('tr-TR') : '-'}</span>
              </div>

              <div class="content-box">${escapeHtml(announcement.content)}</div>

              <div class="action-cells">
                <a href="/announcements/${announcement.id}/edit" class="btn btn-primary">Düzenle</a>
                <form action="/announcements/${announcement.id}/delete" method="POST" style="margin:0;" onsubmit="return confirm('Bu duyuruyu silmek istediğinizden emin misiniz?');">
                  <button type="submit" class="btn btn-danger">Duyuruyu Sil</button>
                </form>
              </div>
            </div>
          </div>
        </main>
        ${MintlifyTheme.renderFooter()}
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
        <title>Duyuru Düzenle — ${escapeHtml(announcement.title)}</title>
        <style>
          ${MintlifyTheme.getBaseStyles()}
          .checkbox-group { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
          .checkbox-group input { width: 16px; height: 16px; accent-color: var(--brand-green-deep); cursor: pointer; }
        </style>
      </head>
      <body>
        ${MintlifyTheme.renderHeader('announcements')}
        <main class="page-main">
          <div class="page-container" style="max-width: 680px;">
            <div style="margin-bottom: 18px;">
              <a href="/announcements" class="btn btn-secondary btn-sm">← İptal / Duyurulara Dön</a>
            </div>

            <div class="card-base">
              <div class="card-title-row">
                <h1 class="card-heading">Duyuruyu Düzenle</h1>
                <span class="code-inline">#${announcement.id}</span>
              </div>

              <form action="/announcements/${announcement.id}/update" method="POST">
                <div class="form-group" style="margin-bottom: 16px;">
                  <label for="title">Duyuru Başlığı</label>
                  <input type="text" id="title" name="title" value="${escapeHtml(announcement.title || '')}" required>
                </div>
                <div class="form-group" style="margin-bottom: 16px;">
                  <label for="category">Kategori</label>
                  <select id="category" name="category">
                    <option value="Genel" ${announcement.category === 'Genel' ? 'selected' : ''}>Genel</option>
                    <option value="Etkinlik" ${announcement.category === 'Etkinlik' ? 'selected' : ''}>Etkinlik</option>
                    <option value="Kariyer & İş" ${announcement.category === 'Kariyer & İş' ? 'selected' : ''}>Kariyer & İş</option>
                    <option value="Akademik" ${announcement.category === 'Akademik' ? 'selected' : ''}>Akademik</option>
                    <option value="Burs & Destek" ${announcement.category === 'Burs & Destek' ? 'selected' : ''}>Burs & Destek</option>
                  </select>
                </div>
                <div class="form-group" style="margin-bottom: 16px;">
                  <label for="author">Yayınlayan</label>
                  <input type="text" id="author" name="author" value="${escapeHtml(announcement.author || '')}">
                </div>
                <div class="form-group" style="margin-bottom: 16px;">
                  <label for="content">Duyuru İçeriği</label>
                  <textarea id="content" name="content" required>${escapeHtml(announcement.content || '')}</textarea>
                </div>
                <div class="checkbox-group">
                  <input type="checkbox" id="isPinned" name="isPinned" value="true" ${announcement.isPinned ? 'checked' : ''}>
                  <label for="isPinned" style="cursor: pointer; font-size: 14px; font-weight: 500;">Bu duyuruyu başa sabitle</label>
                </div>
                <div class="action-cells">
                  <button type="submit" class="btn btn-primary">Değişiklikleri Kaydet</button>
                  <a href="/announcements" class="btn btn-secondary">İptal</a>
                </div>
              </form>
            </div>
          </div>
        </main>
        ${MintlifyTheme.renderFooter()}
      </body>
      </html>
    `;
  },

  /**
   * 4. CREATE RESPONSE - Render Created View (POST /announcements)
   */
  renderAnnouncementCreatedPage(newAnnouncement) {
    return renderStatusCard({
      title: 'Duyuru Başarıyla Yayınlandı',
      message: `<strong>"${escapeHtml(newAnnouncement.title)}"</strong> duyurusu listeye eklendi.`,
      badgeText: 'Yayınlandı',
      badgeClass: 'badge-green'
    });
  },

  /**
   * 5. UPDATE RESPONSE - Render Updated View (POST /announcements/:id/update)
   */
  renderAnnouncementUpdatedPage(updatedAnnouncement) {
    return renderStatusCard({
      title: 'Duyuru Güncellendi',
      message: `<strong>"${escapeHtml(updatedAnnouncement.title)}"</strong> duyurusu güncellendi.`,
      badgeText: 'Güncellendi',
      badgeClass: 'badge-warn'
    });
  },

  /**
   * 6. DELETE RESPONSE - Render Deleted View (POST /announcements/:id/delete)
   */
  renderAnnouncementDeletedPage(deletedAnnouncement) {
    return renderStatusCard({
      title: 'Duyuru Silindi',
      message: `ID'si <span class="code-inline">#${deletedAnnouncement.id}</span> olan <strong>"${escapeHtml(deletedAnnouncement.title)}"</strong> duyurusu sistemden kaldırıldı.`,
      badgeText: 'Silindi',
      badgeClass: 'badge-error'
    });
  }
};

module.exports = AnnouncementViews;
