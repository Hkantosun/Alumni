/**
 * User View Layer - Responsible for generating HTML representations for User Web Pages.
 * Styled consistently with DESIGN.md (Mintlify Design System) via MintlifyTheme.
 * Full CRUD View Templates:
 *   1. Listing View (GET /users -> Read All)
 *   2. Detail View (GET /users/:id -> Read One)
 *   3. Edit Form View (GET /users/:id/edit -> Update Form)
 *   4. Created View (POST /users -> Create Response)
 *   5. Updated View (POST /users/:id/update -> Update Response)
 *   6. Deleted View (POST /users/:id/delete -> Delete Response)
 */

const MintlifyTheme = require('./mintlifyTheme');
const DashboardViews = require('./dashboardViews');
const { escapeHtml } = MintlifyTheme;

function renderStatusCard({ title, message, badgeText, badgeClass = 'badge-green', backHref = '/users', backLabel = 'Mezun Listesine Dön' }) {
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
      ${MintlifyTheme.renderHeader('users')}
      <main class="page-main">
        <div class="page-container" style="max-width: 560px; margin-top: 64px;">
          <div class="card-base" style="text-align: center; padding: 36px;">
            <span class="${badgeClass}" style="margin-bottom: 14px;">${escapeHtml(badgeText)}</span>
            <h1 style="font-size: 24px; font-weight: 600; color: var(--ink); margin-bottom: 10px;">${escapeHtml(title)}</h1>
            <p style="font-size: 15px; color: var(--steel); margin-bottom: 24px;">${message}</p>
            <a href="${backHref}" class="btn btn-primary">${escapeHtml(backLabel)}</a>
          </div>
        </div>
      </main>
      ${MintlifyTheme.renderFooter()}
    </body>
    </html>
  `;
}

const UserViews = {
  /**
   * 1. READ ALL - Render User Listing HTML View (GET /users)
   */
  renderUserListPage(users) {
    const alumniCount = users.filter(u => (u.role || '').toLowerCase() === 'alumni').length;
    const studentCount = users.filter(u => (u.role || '').toLowerCase() === 'student').length;
    const staffCount = users.filter(u => {
      const r = (u.role || '').toLowerCase();
      return r === 'academic_staff' || r === 'academic staff' || r === 'admin';
    }).length;

    const userRows = users.length > 0
      ? users.map(u => `
          <tr>
            <td><span class="code-inline">#${u.id}</span></td>
            <td><strong style="color: var(--ink); font-weight: 600;">${escapeHtml(u.name || '-')}</strong></td>
            <td style="color: var(--steel);">${escapeHtml(u.email || '-')}</td>
            <td><span class="badge-tag">${escapeHtml(u.role || u.department || 'Alumni')}</span></td>
            <td style="color: var(--steel); font-size: 13px;">${u.createdAt ? new Date(u.createdAt).toLocaleDateString('tr-TR') : '-'}</td>
            <td class="action-cells">
              <a href="/users/${u.id}" class="btn btn-secondary btn-sm">Detay</a>
              <a href="/users/${u.id}/edit" class="btn btn-warn btn-sm">Düzenle</a>
              <form action="/users/${u.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?');">
                <button type="submit" class="btn btn-danger btn-sm">Sil</button>
              </form>
            </td>
          </tr>
        `).join('')
      : `<tr><td colspan="6" style="text-align: center; color: var(--steel); padding: 32px;">Henüz kullanıcı bulunmamaktadır. Aşağıdaki formu kullanarak yeni bir kullanıcı oluşturabilirsiniz.</td></tr>`;

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mezunlar & Kullanıcılar — İÜ YBS</title>
        <style>
          ${MintlifyTheme.getBaseStyles()}
          .user-create-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr auto;
            gap: 14px;
            align-items: end;
          }
          @media (max-width: 900px) {
            .user-create-grid { grid-template-columns: 1fr; }
          }
        </style>
      </head>
      <body>
        ${MintlifyTheme.renderHeader('users')}

        <main class="page-main">
          <div class="page-container">
            <div class="page-header-block">
              <div>
                <span class="section-kicker"><span class="mint-dot"></span> TOPLULUK DİZİNİ</span>
                <h1 class="page-title">Mezunlar & Kullanıcılar</h1>
                <p class="page-subtitle">Mezunları, aktif öğrencileri ve akademik kadroyu tek merkezden görüntüleyin ve yönetin.</p>
              </div>
              <a href="/api/users" target="_blank" class="btn btn-secondary">JSON API ↗</a>
            </div>

            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-label">Toplam Kayıt</div>
                <div class="stat-value"><span class="mint-dot"></span> ${users.length}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Mezunlar</div>
                <div class="stat-value">${alumniCount}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Öğrenciler</div>
                <div class="stat-value">${studentCount}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Akademik & Yönetim</div>
                <div class="stat-value">${staffCount}</div>
              </div>
            </div>

            <!-- CREATE FORM (POST /users) -->
            <section class="card-feature">
              <div class="card-title-row">
                <h2 class="card-heading">Yeni Kullanıcı Oluştur</h2>
                <span class="code-inline">POST /users</span>
              </div>
              <form action="/users" method="POST" class="user-create-grid">
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
                <button type="submit" class="btn btn-accent-green">Kullanıcı Ekle</button>
              </form>
            </section>

            <!-- LISTING TABLE (GET /users) -->
            <section class="card-base">
              <div class="card-title-row">
                <h2 class="card-heading">Kayıtlı Kullanıcı Listesi</h2>
                <span class="badge-green">${users.length} Kayıt</span>
              </div>
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Ad Soyad</th>
                      <th>E-posta</th>
                      <th>Rol</th>
                      <th>Kayıt Tarihi</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${userRows}
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
   * 2. READ ONE - Render User Detail HTML View (GET /users/:id)
   */
  renderUserDetailPage(user, roleProfile = null) {
    const roleProfileRows = roleProfile
      ? DashboardViews.renderRoleProfileRows(user, roleProfile)
      : '';
    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${escapeHtml(user.name || 'Kullanıcı #' + user.id)} — İÜ YBS</title>
        <style>
          ${MintlifyTheme.getBaseStyles()}
        </style>
      </head>
      <body>
        ${MintlifyTheme.renderHeader('users')}
        <main class="page-main">
          <div class="page-container" style="max-width: 700px;">
            <div style="margin-bottom: 18px;">
              <a href="/users" class="btn btn-secondary btn-sm">← Listeye Dön</a>
            </div>

            <div class="card-base">
              <div class="card-title-row">
                <div>
                  <span class="code-inline">#${user.id}</span>
                  <h1 style="font-size: 24px; font-weight: 600; color: var(--ink); margin-top: 8px;">${escapeHtml(user.name || 'Kullanıcı #' + user.id)}</h1>
                </div>
                <span class="badge-tag">${escapeHtml(user.role || user.department || 'Alumni')}</span>
              </div>

              <div class="table-wrap" style="margin-bottom: 24px;">
                <table>
                  <tbody>
                    <tr>
                      <td style="width: 180px; color: var(--steel); font-weight: 500;">Kullanıcı ID</td>
                      <td><span class="code-inline">#${user.id}</span></td>
                    </tr>
                    <tr>
                      <td style="color: var(--steel); font-weight: 500;">E-posta Adresi</td>
                      <td>${escapeHtml(user.email || 'Belirtilmemiş')}</td>
                    </tr>
                    <tr>
                      <td style="color: var(--steel); font-weight: 500;">Rol / Bölüm</td>
                      <td><span class="badge-tag">${escapeHtml(user.role || user.department || 'Alumni')}</span></td>
                    </tr>
                    <tr>
                      <td style="color: var(--steel); font-weight: 500;">Kayıt Tarihi</td>
                      <td>${user.createdAt ? new Date(user.createdAt).toLocaleString('tr-TR') : '-'}</td>
                    </tr>
                    ${user.updatedAt ? `
                    <tr>
                      <td style="color: var(--steel); font-weight: 500;">Son Güncelleme</td>
                      <td>${new Date(user.updatedAt).toLocaleString('tr-TR')}</td>
                    </tr>
                    ` : ''}
                    ${roleProfileRows}
                  </tbody>
                </table>
              </div>

              <div class="action-cells">
                <a href="/users/${user.id}/edit" class="btn btn-primary">Düzenle</a>
                <a href="/users/${user.id}/applications" class="btn btn-nested">Başvuruları Gör (Nested)</a>
                <a href="/users/${user.id}/job-postings" class="btn btn-secondary">Paylaşılan İlanlar</a>
                <form action="/users/${user.id}/delete" method="POST" style="margin:0;" onsubmit="return confirm('Silmek istediğinizden emin misiniz?');">
                  <button type="submit" class="btn btn-danger">Kullanıcıyı Sil</button>
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
   * 3. UPDATE FORM - Render Edit User HTML Form View (GET /users/:id/edit)
   */
  renderUserEditPage(user) {
    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kullanıcı Düzenle — ${escapeHtml(user.name)}</title>
        <style>
          ${MintlifyTheme.getBaseStyles()}
        </style>
      </head>
      <body>
        ${MintlifyTheme.renderHeader('users')}
        <main class="page-main">
          <div class="page-container" style="max-width: 620px;">
            <div style="margin-bottom: 18px;">
              <a href="/users" class="btn btn-secondary btn-sm">← İptal / Listeye Dön</a>
            </div>

            <div class="card-base">
              <div class="card-title-row">
                <h1 class="card-heading">Kullanıcı Düzenle</h1>
                <span class="code-inline">#${user.id}</span>
              </div>

              <form action="/users/${user.id}/update" method="POST">
                <div class="form-group" style="margin-bottom: 16px;">
                  <label for="name">Ad Soyad</label>
                  <input type="text" id="name" name="name" value="${escapeHtml(user.name || '')}" required>
                </div>
                <div class="form-group" style="margin-bottom: 16px;">
                  <label for="email">E-posta Adresi</label>
                  <input type="email" id="email" name="email" value="${escapeHtml(user.email || '')}" required>
                </div>
                <div class="form-group" style="margin-bottom: 24px;">
                  <label for="role">Rol / Durum</label>
                  <select id="role" name="role">
                    <option value="Alumni" ${(user.role || '').toLowerCase() === 'alumni' ? 'selected' : ''}>Mezun (Alumni)</option>
                    <option value="Student" ${(user.role || '').toLowerCase() === 'student' ? 'selected' : ''}>Öğrenci (Student)</option>
                    <option value="Academic Staff" ${(user.role || '').toLowerCase().includes('academic') ? 'selected' : ''}>Akademik Personel</option>
                  </select>
                </div>
                <div class="action-cells">
                  <button type="submit" class="btn btn-primary">Değişiklikleri Kaydet</button>
                  <a href="/users" class="btn btn-secondary">İptal</a>
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
   * 4. CREATE RESPONSE - Render Created View (POST /users)
   */
  renderUserCreatedPage(newUser) {
    return renderStatusCard({
      title: 'Kullanıcı Başarıyla Oluşturuldu',
      message: `<strong>${escapeHtml(newUser.name)}</strong> (${escapeHtml(newUser.email)}) sisteme eklendi.`,
      badgeText: 'Kayıt Oluşturuldu',
      badgeClass: 'badge-green'
    });
  },

  /**
   * 5. UPDATE RESPONSE - Render Updated View (POST /users/:id/update)
   */
  renderUserUpdatedPage(updatedUser) {
    return renderStatusCard({
      title: 'Kullanıcı Bilgileri Güncellendi',
      message: `<strong>${escapeHtml(updatedUser.name)}</strong> bilgileri başarıyla kaydedildi.`,
      badgeText: 'Güncellendi',
      badgeClass: 'badge-warn'
    });
  },

  /**
   * 6. DELETE RESPONSE - Render Deleted View (POST /users/:id/delete)
   */
  renderUserDeletedPage(deletedUser) {
    return renderStatusCard({
      title: 'Kullanıcı Silindi',
      message: `ID'si <span class="code-inline">#${deletedUser.id}</span> olan <strong>${escapeHtml(deletedUser.name)}</strong> kaydı sistemden kaldırıldı.`,
      badgeText: 'Silindi',
      badgeClass: 'badge-error'
    });
  }
};

module.exports = UserViews;
