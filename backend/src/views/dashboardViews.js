/**
 * DashboardViews - Role-Specific User Workspace Pages (/dashboard)
 * Renders tailored views for: student, alumni, academic_staff, admin.
 */

const MintlifyTheme = require('./mintlifyTheme');
const { escapeHtml } = MintlifyTheme;

function renderRoleProfileRows(user, roleProfile) {
  if (!roleProfile) {
    return `<tr><td colspan="2" style="color:var(--steel);">Bu hesap için henüz rol profil detayı tanımlanmamış.</td></tr>`;
  }

  const deptLabel = roleProfile.department_code
    ? `${roleProfile.department_code} — ${roleProfile.department_name}`
    : '-';

  if (user.role === 'alumni') {
    return `
      <tr><td style="width:190px;color:var(--steel);font-weight:500;">Bölüm</td><td>${escapeHtml(deptLabel)}</td></tr>
      <tr><td style="color:var(--steel);font-weight:500;">Mezuniyet Yılı / Derece</td><td>${escapeHtml(roleProfile.graduation_year)} • ${escapeHtml(roleProfile.degree)}</td></tr>
      <tr><td style="color:var(--steel);font-weight:500;">Güncel Pozisyon</td><td>${escapeHtml(roleProfile.current_job_title || '-')} @ ${escapeHtml(roleProfile.current_company || '-')}</td></tr>
      <tr><td style="color:var(--steel);font-weight:500;">Şehir</td><td>${escapeHtml(roleProfile.current_city || '-')}</td></tr>
      <tr><td style="color:var(--steel);font-weight:500;">Mentörlük Durumu</td><td><span class="${roleProfile.available_for_mentorship ? 'badge-green' : 'badge-tag'}">${roleProfile.available_for_mentorship ? 'Mentörlüğe Açık' : 'Kapalı'}</span></td></tr>
    `;
  }

  if (user.role === 'student') {
    return `
      <tr><td style="width:190px;color:var(--steel);font-weight:500;">Bölüm</td><td>${escapeHtml(deptLabel)}</td></tr>
      <tr><td style="color:var(--steel);font-weight:500;">Öğrenci Numarası</td><td><span class="code-inline">${escapeHtml(roleProfile.student_number)}</span></td></tr>
      <tr><td style="color:var(--steel);font-weight:500;">Eğitim Dönemi</td><td>${escapeHtml(roleProfile.enrollment_year)} – ${escapeHtml(roleProfile.expected_graduation_year)} (${escapeHtml(roleProfile.degree)})</td></tr>
      <tr><td style="color:var(--steel);font-weight:500;">İlgi Alanları</td><td>${escapeHtml(roleProfile.interests || '-')}</td></tr>
    `;
  }

  if (user.role === 'academic_staff') {
    return `
      <tr><td style="width:190px;color:var(--steel);font-weight:500;">Bölüm</td><td>${escapeHtml(deptLabel)}</td></tr>
      <tr><td style="color:var(--steel);font-weight:500;">Akademik Unvan</td><td>${escapeHtml(roleProfile.academic_title)}</td></tr>
      <tr><td style="color:var(--steel);font-weight:500;">Ofis / Oda</td><td>${escapeHtml(roleProfile.office_location || '-')}</td></tr>
      <tr><td style="color:var(--steel);font-weight:500;">Araştırma Alanları</td><td>${escapeHtml(roleProfile.research_areas || '-')}</td></tr>
    `;
  }

  return '';
}

const DashboardViews = {
  renderRoleProfileRows,

  renderDashboard({
    user,
    roleProfile,
    myApplications = [],
    myJobPostings = [],
    availableMentors = [],
    mentorshipRequests = [],
    recentAnnouncements = [],
    msg = null,
    err = null
  }) {
    const role = String(user.role || '').toLowerCase();

    const feedbackBanner = err
      ? `<div style="background:#fef2f2;border:1px solid #fecaca;color:#991b1b;padding:12px 16px;border-radius:8px;margin-bottom:20px;font-size:14px;"><strong>Hata:</strong> ${escapeHtml(err)}</div>`
      : msg
        ? `<div style="background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46;padding:12px 16px;border-radius:8px;margin-bottom:20px;font-size:14px;"><strong>Bilgi:</strong> ${escapeHtml(msg)}</div>`
        : '';

    let roleWorkspaceHtml = '';

    if (role === 'student') {
      const mentorOptions = availableMentors.map(m =>
        `<option value="${m.alumni_profile_id}">${escapeHtml(m.name)} — ${escapeHtml(m.current_job_title || 'Mezun')} (${escapeHtml(m.current_company || m.department_code)})</option>`
      ).join('');

      const requestRows = mentorshipRequests.map(r => `
        <tr>
          <td><span class="code-inline">#${r.id}</span></td>
          <td><strong>${escapeHtml(r.mentor_name)}</strong><div style="font-size:12px;color:var(--steel);">${escapeHtml(r.mentor_company || '-')}</div></td>
          <td><span class="badge-tag">${escapeHtml(r.status)}</span></td>
          <td style="font-size:13px;color:var(--steel);">${escapeHtml(r.request_message)}</td>
        </tr>
      `).join('');

      const appRows = myApplications.map(a => `
        <tr>
          <td><span class="code-inline">#${a.id}</span></td>
          <td><strong>${escapeHtml(a.jobTitle || '-')}</strong><div style="font-size:12px;color:var(--steel);">${escapeHtml(a.jobCompany || '-')}</div></td>
          <td><span class="badge-tag">${escapeHtml(a.status)}</span></td>
        </tr>
      `).join('');

      roleWorkspaceHtml = `
        <div class="dash-two-col">
          <section class="card-base">
            <div class="card-title-row">
              <h2 class="card-heading">Mentörlük Talebi Gönder</h2>
              <span class="badge-green">${availableMentors.length} Uygun Mezun</span>
            </div>
            ${availableMentors.length > 0 ? `
              <form action="/dashboard/mentorship-request" method="POST" style="display:grid;gap:12px;margin-bottom:18px;">
                <div class="form-group">
                  <label for="mentor_alumni_id">Mentör Mezun Seçin *</label>
                  <select id="mentor_alumni_id" name="mentor_alumni_id" required>
                    ${mentorOptions}
                  </select>
                </div>
                <div class="form-group">
                  <label for="request_message">Talep Mesajınız *</label>
                  <input type="text" id="request_message" name="request_message" placeholder="ör. Kariyer ve staj tavsiyesi almak istiyorum." required>
                </div>
                <button type="submit" class="btn btn-accent-green btn-sm">Mentörlük Talebi Gönder</button>
              </form>
            ` : `<p style="color:var(--steel);font-size:14px;margin-bottom:16px;">Şu anda mentörlüğe açık mezun bulunmuyor.</p>`}
            <div class="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Mentör</th><th>Durum</th><th>Mesaj</th></tr></thead>
                <tbody>${requestRows || '<tr><td colspan="4" style="text-align:center;color:var(--steel);">Henüz mentörlük talebiniz yok.</td></tr>'}</tbody>
              </table>
            </div>
          </section>

          <section class="card-base">
            <div class="card-title-row">
              <h2 class="card-heading">Başvurularım</h2>
              <a href="/users/${user.id}/applications" class="btn btn-secondary btn-sm">Tümünü Yönet →</a>
            </div>
            <div class="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>İlan</th><th>Durum</th></tr></thead>
                <tbody>${appRows || '<tr><td colspan="3" style="text-align:center;color:var(--steel);">Henüz iş/staj başvurunuz yok.</td></tr>'}</tbody>
              </table>
            </div>
          </section>
        </div>
      `;
    } else if (role === 'alumni') {
      const incomingRows = mentorshipRequests.map(r => `
        <tr>
          <td><span class="code-inline">#${r.id}</span></td>
          <td><strong>${escapeHtml(r.student_name)}</strong><div style="font-size:12px;color:var(--steel);">${escapeHtml(r.student_email)}</div></td>
          <td style="font-size:13px;color:var(--steel);">${escapeHtml(r.request_message)}</td>
          <td><span class="badge-tag">${escapeHtml(r.status)}</span></td>
          <td class="action-cells">
            ${r.status === 'pending' ? `
              <form action="/dashboard/mentorship-requests/${r.id}/respond" method="POST" style="display:inline;">
                <input type="hidden" name="status" value="accepted">
                <button type="submit" class="btn btn-accent-green btn-sm">Kabul Et</button>
              </form>
              <form action="/dashboard/mentorship-requests/${r.id}/respond" method="POST" style="display:inline;">
                <input type="hidden" name="status" value="rejected">
                <button type="submit" class="btn btn-danger btn-sm">Reddet</button>
              </form>
            ` : '-'}
          </td>
        </tr>
      `).join('');

      const jobRows = myJobPostings.map(j => `
        <tr>
          <td><span class="code-inline">#${j.id}</span></td>
          <td><strong>${escapeHtml(j.title)}</strong><div style="font-size:12px;color:var(--steel);">${escapeHtml(j.company)} • ${escapeHtml(j.job_type)}</div></td>
          <td><a href="/job-postings/${j.id}/applications" class="btn btn-secondary btn-sm">Başvurular</a></td>
        </tr>
      `).join('');

      roleWorkspaceHtml = `
        <div class="dash-two-col">
          <section class="card-base">
            <div class="card-title-row">
              <h2 class="card-heading">Gelen Mentörlük Talepleri</h2>
              <form action="/dashboard/toggle-mentorship" method="POST" style="margin:0;">
                <button type="submit" class="btn btn-sm ${roleProfile && roleProfile.available_for_mentorship ? 'btn-accent-green' : 'btn-secondary'}">
                  ${roleProfile && roleProfile.available_for_mentorship ? 'Mentörlük: Açık (Kapat)' : 'Mentörlük: Kapalı (Aç)'}
                </button>
              </form>
            </div>
            <div class="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Öğrenci</th><th>Mesaj</th><th>Durum</th><th>Yanıt</th></tr></thead>
                <tbody>${incomingRows || '<tr><td colspan="5" style="text-align:center;color:var(--steel);">Henüz gelen mentörlük talebi yok.</td></tr>'}</tbody>
              </table>
            </div>
          </section>

          <section class="card-base">
            <div class="card-title-row">
              <h2 class="card-heading">Paylaştığım İlanlar</h2>
              <a href="/users/${user.id}/job-postings" class="btn btn-secondary btn-sm">İlan Ekle / Yönet →</a>
            </div>
            <div class="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>İlan</th><th>Başvurular</th></tr></thead>
                <tbody>${jobRows || '<tr><td colspan="3" style="text-align:center;color:var(--steel);">Henüz paylaştığınız bir ilan yok.</td></tr>'}</tbody>
              </table>
            </div>
          </section>
        </div>
      `;
    } else if (role === 'academic_staff') {
      const annRows = recentAnnouncements.slice(0, 5).map(a => `
        <tr>
          <td><span class="code-inline">#${a.id}</span></td>
          <td><strong>${escapeHtml(a.title)}</strong><div style="font-size:12px;color:var(--steel);">${escapeHtml(a.category)}</div></td>
        </tr>
      `).join('');

      roleWorkspaceHtml = `
        <div class="dash-two-col">
          <section class="card-base">
            <div class="card-title-row">
              <h2 class="card-heading">Hızlı Duyuru Yayınla</h2>
              <span class="code-inline">academic_staff</span>
            </div>
            <form action="/dashboard/announcements" method="POST" style="display:grid;gap:12px;">
              <div class="form-group">
                <label for="ann_title">Başlık *</label>
                <input type="text" id="ann_title" name="title" placeholder="ör. Bitirme Projesi Takvimi" required>
              </div>
              <div class="form-group">
                <label for="ann_cat">Kategori</label>
                <input type="text" id="ann_cat" name="category" value="Akademik">
              </div>
              <div class="form-group">
                <label for="ann_content">İçerik *</label>
                <textarea id="ann_content" name="content" placeholder="Öğrenciler ve mezunlar için duyuru metni..." required></textarea>
              </div>
              <button type="submit" class="btn btn-accent-green btn-sm">Duyuru Yayınla</button>
            </form>
          </section>

          <section class="card-base">
            <div class="card-title-row">
              <h2 class="card-heading">Son Duyurular</h2>
              <a href="/announcements" class="btn btn-secondary btn-sm">Tüm Duyurular →</a>
            </div>
            <div class="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Duyuru</th></tr></thead>
                <tbody>${annRows || '<tr><td colspan="2" style="text-align:center;color:var(--steel);">Duyuru bulunamadı.</td></tr>'}</tbody>
              </table>
            </div>
          </section>
        </div>
      `;
    } else if (role === 'admin') {
      roleWorkspaceHtml = `
        <section class="card-feature">
          <div class="card-title-row">
            <div>
              <h2 class="card-heading">Yönetici Çalışma Alanı</h2>
              <p style="font-size:14px;color:var(--steel);margin-top:4px;">Tüm kullanıcı, rol, bölüm, duyuru ve başvuru verilerini yönetmek için Admin Panelini kullanabilirsiniz.</p>
            </div>
            <a href="/admin" class="btn btn-accent-green">Admin Paneline Git →</a>
          </div>
        </section>
      `;
    }

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kişisel Panelim — İÜ YBS</title>
        <style>
          ${MintlifyTheme.getBaseStyles()}
          .dash-two-col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          @media (max-width: 960px) {
            .dash-two-col { grid-template-columns: 1fr; }
          }
        </style>
      </head>
      <body>
        ${MintlifyTheme.renderHeader('dashboard')}
        <main class="page-main">
          <div class="page-container">
            <div class="page-header-block">
              <div>
                <span class="section-kicker"><span class="mint-dot"></span> KİŞİSEL ÇALIŞMA ALANI</span>
                <h1 class="page-title">Hoş Geldiniz, ${escapeHtml(user.name)}</h1>
                <p class="page-subtitle">Rolünüze özel profil bilgileri, başvurular ve mentörlük/yönetim araçları.</p>
              </div>
              <div class="action-cells">
                <a href="/users/${user.id}/edit" class="btn btn-secondary">Profili Düzenle</a>
                <a href="/users/${user.id}" class="btn btn-primary">Genel Profilim</a>
              </div>
            </div>

            ${feedbackBanner}

            <section class="card-base" style="margin-bottom: 24px;">
              <div class="card-title-row">
                <h2 class="card-heading">Hesap & Rol Profilim</h2>
                <span class="badge-tag">${escapeHtml(user.role)}</span>
              </div>
              <div class="table-wrap">
                <table>
                  <tbody>
                    <tr><td style="width:190px;color:var(--steel);font-weight:500;">E-posta</td><td>${escapeHtml(user.email)}</td></tr>
                    ${renderRoleProfileRows(user, roleProfile)}
                  </tbody>
                </table>
              </div>
            </section>

            ${roleWorkspaceHtml}
          </div>
        </main>
        ${MintlifyTheme.renderFooter()}
      </body>
      </html>
    `;
  }
};

module.exports = DashboardViews;
