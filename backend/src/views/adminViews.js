/**
 * AdminViews - HTML Templates for the Admin Control Panel (/admin)
 * Styled consistently with DESIGN.md (Mintlify Design System) via MintlifyTheme.
 */

const MintlifyTheme = require('./mintlifyTheme');
const { escapeHtml } = MintlifyTheme;

const ROLES = ['alumni', 'student', 'academic_staff', 'admin'];
const APP_STATUSES = ['pending', 'under_review', 'accepted', 'rejected', 'withdrawn'];

const AdminViews = {
  renderDashboard({ currentUser, users, departments, announcements, jobPostings, applications, msg = null, err = null }) {
    const adminCount = users.filter(u => u.role === 'admin').length;
    const activeUsersCount = users.filter(u => u.is_active).length;

    const feedbackBanner = err
      ? `<div style="background:#fef2f2;border:1px solid #fecaca;color:#991b1b;padding:12px 16px;border-radius:8px;margin-bottom:20px;font-size:14px;"><strong>Hata:</strong> ${escapeHtml(err)}</div>`
      : msg
        ? `<div style="background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46;padding:12px 16px;border-radius:8px;margin-bottom:20px;font-size:14px;"><strong>Başarılı:</strong> ${escapeHtml(msg)}</div>`
        : '';

    const userRows = users.map(u => {
      const isSelf = Number(u.id) === Number(currentUser.id);
      const roleOptions = ROLES.map(r =>
        `<option value="${r}" ${u.role === r ? 'selected' : ''}>${r}</option>`
      ).join('');

      return `
        <tr>
          <td><span class="code-inline">#${u.id}</span></td>
          <td>
            <strong style="color:var(--ink);">${escapeHtml(u.name)}</strong>
            ${isSelf ? '<span class="badge-green" style="margin-left:6px;">Siz</span>' : ''}
            <div style="font-size:12px;color:var(--steel);">${escapeHtml(u.email)}</div>
          </td>
          <td>
            <form action="/admin/users/${u.id}/role" method="POST" style="display:flex;gap:6px;align-items:center;">
              <select name="role" style="height:32px;padding:4px 8px;border:1px solid var(--hairline);border-radius:6px;font-size:13px;background:#fff;">
                ${roleOptions}
              </select>
              <button type="submit" class="btn btn-secondary btn-sm">Kaydet</button>
            </form>
          </td>
          <td>
            <form action="/admin/users/${u.id}/toggle-active" method="POST" style="display:inline;">
              <button type="submit" class="btn btn-sm ${u.is_active ? 'btn-accent-green' : 'btn-danger'}">
                ${u.is_active ? 'Aktif' : 'Pasif'}
              </button>
            </form>
          </td>
          <td>
            <form action="/admin/users/${u.id}/toggle-verified" method="POST" style="display:inline;">
              <button type="submit" class="btn btn-sm ${u.is_verified ? 'btn-secondary' : 'btn-warn'}">
                ${u.is_verified ? 'Onaylı' : 'Onaysız'}
              </button>
            </form>
          </td>
          <td>
            ${isSelf
              ? '<span style="font-size:12px;color:var(--stone);">Kendi hesabınız</span>'
              : `<form action="/admin/users/${u.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('Kullanıcı #${u.id} kalıcı olarak silinsin mi?');">
                   <button type="submit" class="btn btn-danger btn-sm">Sil</button>
                 </form>`}
          </td>
        </tr>
      `;
    }).join('');

    const departmentRows = departments.map(d => `
      <tr>
        <td><span class="code-inline">${escapeHtml(d.code)}</span></td>
        <td><strong style="color:var(--ink);">${escapeHtml(d.name)}</strong></td>
        <td style="color:var(--steel);">${escapeHtml(d.faculty)}</td>
        <td>
          <form action="/admin/departments/${d.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('Bölüm silinsin mi?');">
            <button type="submit" class="btn btn-danger btn-sm">Sil</button>
          </form>
        </td>
      </tr>
    `).join('');

    const announcementRows = announcements.map(a => `
      <tr>
        <td><span class="code-inline">#${a.id}</span></td>
        <td>
          <strong style="color:var(--ink);">${escapeHtml(a.title)}</strong>
          <div style="font-size:12px;color:var(--steel);">${escapeHtml(a.category)} • ${escapeHtml(a.author)}</div>
        </td>
        <td class="action-cells">
          <form action="/admin/announcements/${a.id}/toggle-pin" method="POST" style="display:inline;">
            <button type="submit" class="btn btn-sm ${a.isPinned ? 'btn-accent-green' : 'btn-secondary'}">
              ${a.isPinned ? 'Sabitli' : 'Sabitle'}
            </button>
          </form>
          <form action="/admin/announcements/${a.id}/delete" method="POST" style="display:inline;">
            <button type="submit" class="btn btn-danger btn-sm">Sil</button>
          </form>
        </td>
      </tr>
    `).join('');

    const jobRows = jobPostings.map(j => `
      <tr>
        <td><span class="code-inline">#${j.id}</span></td>
        <td>
          <strong style="color:var(--ink);">${escapeHtml(j.title)}</strong>
          <div style="font-size:12px;color:var(--steel);">${escapeHtml(j.company)} • ${escapeHtml(j.job_type)}</div>
        </td>
        <td class="action-cells">
          <form action="/admin/job-postings/${j.id}/toggle-active" method="POST" style="display:inline;">
            <button type="submit" class="btn btn-sm ${j.is_active ? 'btn-accent-green' : 'btn-warn'}">
              ${j.is_active ? 'Yayında' : 'Pasif'}
            </button>
          </form>
          <form action="/admin/job-postings/${j.id}/delete" method="POST" style="display:inline;">
            <button type="submit" class="btn btn-danger btn-sm">Sil</button>
          </form>
        </td>
      </tr>
    `).join('');

    const applicationRows = applications.map(app => {
      const statusOptions = APP_STATUSES.map(st =>
        `<option value="${st}" ${app.status === st ? 'selected' : ''}>${st}</option>`
      ).join('');
      return `
        <tr>
          <td><span class="code-inline">#${app.id}</span></td>
          <td>
            <strong style="color:var(--ink);">${escapeHtml(app.applicantName || '-')}</strong>
            <div style="font-size:12px;color:var(--steel);">${escapeHtml(app.jobTitle || '-')} (${escapeHtml(app.jobCompany || '-')})</div>
          </td>
          <td>
            <form action="/admin/applications/${app.id}/status" method="POST" style="display:flex;gap:6px;align-items:center;">
              <select name="status" style="height:32px;padding:4px 8px;border:1px solid var(--hairline);border-radius:6px;font-size:13px;background:#fff;">
                ${statusOptions}
              </select>
              <button type="submit" class="btn btn-secondary btn-sm">Güncelle</button>
            </form>
          </td>
        </tr>
      `;
    }).join('');

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Panel — İÜ YBS</title>
        <style>
          ${MintlifyTheme.getBaseStyles()}
          .admin-two-col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          @media (max-width: 960px) {
            .admin-two-col { grid-template-columns: 1fr; }
          }
        </style>
      </head>
      <body>
        ${MintlifyTheme.renderHeader('admin')}

        <main class="page-main">
          <div class="page-container">
            <div class="page-header-block">
              <div>
                <span class="section-kicker"><span class="mint-dot"></span> RBAC YÖNETİCİ KONSOLU</span>
                <h1 class="page-title">Admin Paneli</h1>
                <p class="page-subtitle">Oturum: <strong>${escapeHtml(currentUser.name)}</strong> (${escapeHtml(currentUser.email)}) — Tüm sistem verilerini doğrudan yönetin.</p>
              </div>
              <a href="/users" class="btn btn-secondary">Kullanıcı Dizini</a>
            </div>

            ${feedbackBanner}

            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-label">Kullanıcılar</div>
                <div class="stat-value"><span class="mint-dot"></span> ${users.length}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Aktif / Admin</div>
                <div class="stat-value">${activeUsersCount} / ${adminCount}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">İlan / Başvuru</div>
                <div class="stat-value">${jobPostings.length} / ${applications.length}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Bölüm / Duyuru</div>
                <div class="stat-value">${departments.length} / ${announcements.length}</div>
              </div>
            </div>

            <!-- 1. KULLANICI & ROL YÖNETİMİ -->
            <section class="card-base" style="margin-bottom: 24px;">
              <div class="card-title-row">
                <h2 class="card-heading">Kullanıcı & Rol Yönetimi</h2>
                <span class="code-inline">users</span>
              </div>
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Kullanıcı</th>
                      <th>Rol Ataması</th>
                      <th>Durum</th>
                      <th>Doğrulama</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>${userRows}</tbody>
                </table>
              </div>
            </section>

            <!-- 2. BÖLÜMLER & DUYURULAR -->
            <div class="admin-two-col" style="margin-bottom: 24px;">
              <section class="card-base">
                <div class="card-title-row">
                  <h2 class="card-heading">Bölümler</h2>
                  <span class="code-inline">departments</span>
                </div>
                <form action="/admin/departments" method="POST" style="display:grid;gap:10px;margin-bottom:16px;">
                  <div class="form-grid">
                    <div class="form-group">
                      <label for="dept_code">Kod *</label>
                      <input type="text" id="dept_code" name="code" placeholder="ör. MIS" required>
                    </div>
                    <div class="form-group">
                      <label for="dept_faculty">Fakülte *</label>
                      <input type="text" id="dept_faculty" name="faculty" placeholder="ör. İktisat Fakültesi" required>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="dept_name">Bölüm Adı *</label>
                    <input type="text" id="dept_name" name="name" placeholder="ör. Yönetim Bilişim Sistemleri" required>
                  </div>
                  <button type="submit" class="btn btn-accent-green btn-sm">Bölüm Ekle</button>
                </form>
                <div class="table-wrap">
                  <table>
                    <thead><tr><th>Kod</th><th>Ad</th><th>Fakülte</th><th>İşlem</th></tr></thead>
                    <tbody>${departmentRows}</tbody>
                  </table>
                </div>
              </section>

              <section class="card-base">
                <div class="card-title-row">
                  <h2 class="card-heading">Duyurular</h2>
                  <span class="code-inline">announcements</span>
                </div>
                <form action="/admin/announcements" method="POST" style="display:grid;gap:10px;margin-bottom:16px;">
                  <div class="form-grid">
                    <div class="form-group">
                      <label for="ann_title">Başlık *</label>
                      <input type="text" id="ann_title" name="title" placeholder="Duyuru başlığı" required>
                    </div>
                    <div class="form-group">
                      <label for="ann_cat">Kategori</label>
                      <input type="text" id="ann_cat" name="category" value="Sistem" placeholder="Genel / Etkinlik">
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="ann_content">İçerik *</label>
                    <input type="text" id="ann_content" name="content" placeholder="Kısa duyuru metni" required>
                  </div>
                  <button type="submit" class="btn btn-accent-green btn-sm">Duyuru Yayınla</button>
                </form>
                <div class="table-wrap">
                  <table>
                    <thead><tr><th>ID</th><th>Duyuru</th><th>İşlemler</th></tr></thead>
                    <tbody>${announcementRows}</tbody>
                  </table>
                </div>
              </section>
            </div>

            <!-- 3. İLANLAR & BAŞVURULAR -->
            <div class="admin-two-col">
              <section class="card-base">
                <div class="card-title-row">
                  <h2 class="card-heading">İş & Staj İlanları</h2>
                  <span class="code-inline">job_postings</span>
                </div>
                <div class="table-wrap">
                  <table>
                    <thead><tr><th>ID</th><th>İlan</th><th>İşlemler</th></tr></thead>
                    <tbody>${jobRows || '<tr><td colspan="3" style="text-align:center;color:var(--steel);">Kayıtlı ilan yok.</td></tr>'}</tbody>
                  </table>
                </div>
              </section>

              <section class="card-base">
                <div class="card-title-row">
                  <h2 class="card-heading">Başvurular</h2>
                  <span class="code-inline">applications</span>
                </div>
                <div class="table-wrap">
                  <table>
                    <thead><tr><th>ID</th><th>Aday / İlan</th><th>Durum Güncelle</th></tr></thead>
                    <tbody>${applicationRows || '<tr><td colspan="3" style="text-align:center;color:var(--steel);">Kayıtlı başvuru yok.</td></tr>'}</tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        </main>

        ${MintlifyTheme.renderFooter()}
      </body>
      </html>
    `;
  }
};

module.exports = AdminViews;
