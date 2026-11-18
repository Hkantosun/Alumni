/**
 * Application View Layer - Responsible for generating HTML representations for Application Web Pages.
 * Styled consistently with DESIGN.md (Mintlify Design System) via MintlifyTheme.
 * Supports:
 *   - Direct Route: GET /applications
 *   - Nested Route: GET /job-postings/:jobPostingId/applications
 *   - Nested Route: GET /users/:userId/applications
 *   - Detail Route: GET /applications/:id
 *   - Edit Form: GET /applications/:id/edit
 */

const MintlifyTheme = require('./mintlifyTheme');
const { escapeHtml } = MintlifyTheme;

function getStatusBadge(status) {
  if (status === 'accepted') return { cls: 'badge-green', label: 'Kabul Edildi (accepted)' };
  if (status === 'rejected') return { cls: 'badge-error', label: 'Reddedildi (rejected)' };
  if (status === 'under_review') return { cls: 'badge-tag', label: 'İnceleniyor (under_review)' };
  if (status === 'withdrawn') return { cls: 'badge-type', label: 'Geri Çekildi (withdrawn)' };
  return { cls: 'badge-warn', label: 'Beklemede (pending)' };
}

const ApplicationViews = {
  /**
   * 1. READ ALL - Render Application List Page (Direct & Nested)
   */
  renderApplicationListPage(applications, { currentJob = null, currentUser = null, jobPostings = [], users = [] } = {}) {
    let headerTitle = 'İş & Staj Başvuruları';
    let bannerHtml = `
      <div class="route-info">
        <strong>Direct & Nested Rota Yapısı:</strong><br>
        • <strong>Direct Rota:</strong> <span class="code-inline">GET /applications</span> (Sistemdeki tüm iş/staj başvuruları)<br>
        • <strong>Nested Rotalar:</strong> <span class="code-inline">GET /job-postings/:jobPostingId/applications</span> veya <span class="code-inline">GET /users/:userId/applications</span>
      </div>
    `;

    if (currentJob) {
      headerTitle = `"${escapeHtml(currentJob.title)}" Başvuruları`;
      bannerHtml = `
        <div class="route-info nested-banner">
          <strong>Nested Route Aktif:</strong> <span class="code-inline">GET /job-postings/${currentJob.id}/applications</span><br>
          Şu anda yalnızca <strong>${escapeHtml(currentJob.company)}</strong> bünyesindeki <strong>${escapeHtml(currentJob.title)}</strong> ilanına ait başvurular listelenmektedir.
          <a href="/job-postings/${currentJob.id}" style="color: var(--ink); margin-left: 10px; font-weight: 600;">İlanı Görüntüle</a>
          <a href="/applications" style="color: var(--brand-tag); margin-left: 10px; font-weight: 600;">Tüm Başvurular (Direct) →</a>
        </div>
      `;
    } else if (currentUser) {
      const applicantName = `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || currentUser.email;
      headerTitle = `${escapeHtml(applicantName)} Başvuruları`;
      bannerHtml = `
        <div class="route-info nested-banner">
          <strong>Nested Route Aktif:</strong> <span class="code-inline">GET /users/${currentUser.id}/applications</span><br>
          Şu anda yalnızca <strong>${escapeHtml(applicantName)}</strong> (${escapeHtml(currentUser.role)}) adayının yaptığı başvurular listelenmektedir.
          <a href="/applications" style="color: var(--brand-tag); margin-left: 10px; font-weight: 600;">Tüm Başvurular (Direct) →</a>
        </div>
      `;
    }

    const totalCount = applications.length;
    const pendingCount = applications.filter(a => a.status === 'pending').length;
    const reviewCount = applications.filter(a => a.status === 'under_review').length;
    const acceptedCount = applications.filter(a => a.status === 'accepted').length;
    const rejectedCount = applications.filter(a => a.status === 'rejected').length;

    const rows = applications.length > 0
      ? applications.map(a => {
          const badge = getStatusBadge(a.status);
          const searchAttr = escapeHtml(`${a.jobTitle || ''} ${a.jobCompany || ''} ${a.applicantName || ''} ${a.applicantEmail || ''} ${a.status}`.toLowerCase());

          return `
            <tr class="app-row" data-search="${searchAttr}">
              <td><span class="code-inline">#${a.id}</span></td>
              <td>
                <a href="/job-postings/${a.job_posting_id}" style="color: var(--ink); font-weight: 600; text-decoration: none;">
                  ${escapeHtml(a.jobTitle || 'İlan #' + a.job_posting_id)}
                </a>
                <div style="font-size: 13px; color: var(--steel); margin-top: 2px;">
                  ${escapeHtml(a.jobCompany || '-')}
                </div>
              </td>
              <td>
                <a href="/users/${a.applicant_user_id}" style="color: var(--ink); font-weight: 500; text-decoration: none;">
                  ${escapeHtml(a.applicantName || 'Aday #' + a.applicant_user_id)}
                </a>
                <div style="font-size: 12px; color: var(--steel);">${escapeHtml(a.applicantEmail || '')}</div>
              </td>
              <td>
                <span class="${badge.cls}">${escapeHtml(a.status)}</span>
              </td>
              <td>
                ${a.resume_url
                  ? `<a href="${escapeHtml(a.resume_url)}" target="_blank" style="color: var(--brand-annotate); font-weight: 500; text-decoration: none; font-size: 13px;">CV Aç ↗</a>`
                  : '<span style="color: var(--stone); font-size: 13px;">CV Yok</span>'
                }
              </td>
              <td style="color: var(--steel); font-size: 13px;">
                ${a.created_at ? new Date(a.created_at).toLocaleDateString('tr-TR') : '-'}
              </td>
              <td class="action-cells">
                <a href="/applications/${a.id}" class="btn btn-secondary btn-sm">Detay</a>
                <a href="/applications/${a.id}/edit" class="btn btn-warn btn-sm">Durum</a>
                <form action="/applications/${a.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('Bu başvuruyu silmek istediğinizden emin misiniz?');">
                  <button type="submit" class="btn btn-danger btn-sm">Sil</button>
                </form>
              </td>
            </tr>
          `;
        }).join('')
      : `<tr><td colspan="7" style="text-align: center; color: var(--steel); padding: 36px;">Henüz kayıtlı başvuru bulunmamaktadır.</td></tr>`;

    const jobOptions = jobPostings.map(j => `
      <option value="${j.id}" ${currentJob && currentJob.id === j.id ? 'selected' : ''}>
        #${j.id} - ${escapeHtml(j.title)} (${escapeHtml(j.company)})
      </option>
    `).join('');

    const userOptions = users.map(u => {
      const displayName = u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email;
      return `<option value="${u.id}" ${currentUser && currentUser.id === u.id ? 'selected' : ''}>#${u.id} - ${escapeHtml(displayName)} (${escapeHtml(u.role)})</option>`;
    }).join('');

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${headerTitle} — İÜ YBS</title>
        <style>
          ${MintlifyTheme.getBaseStyles()}
        </style>
      </head>
      <body>
        ${MintlifyTheme.renderHeader('applications')}

        <main class="page-main">
          <div class="page-container">
            <div class="page-header-block">
              <div>
                <span class="section-kicker"><span class="mint-dot"></span> BAŞVURU SÜREÇLERİ</span>
                <h1 class="page-title">${headerTitle}</h1>
                <p class="page-subtitle">Aday başvurularını, CV bağlantılarını ve değerlendirme statülerini tek ekrandan takip edin.</p>
              </div>
              <div class="action-cells">
                <a href="#new-app-form" class="btn btn-accent-green">+ Yeni Başvuru Gönder</a>
                <a href="/api/applications" target="_blank" class="btn btn-secondary">JSON API ↗</a>
              </div>
            </div>

            <!-- Stats Grid (5 columns) -->
            <div class="stats-grid" style="grid-template-columns: repeat(5, 1fr);">
              <div class="stat-card">
                <div class="stat-label">Toplam</div>
                <div class="stat-value"><span class="mint-dot"></span> ${totalCount}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Beklemede</div>
                <div class="stat-value">${pendingCount}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">İnceleniyor</div>
                <div class="stat-value">${reviewCount}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Kabul Edildi</div>
                <div class="stat-value" style="color: var(--brand-annotate);">${acceptedCount}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Reddedildi</div>
                <div class="stat-value" style="color: var(--brand-error);">${rejectedCount}</div>
              </div>
            </div>

            <section class="card-base">
              ${bannerHtml}

              <div class="filter-bar">
                <input type="text" id="appSearch" class="search-input" placeholder="İlan adı, şirket, aday adı veya durum ara..." oninput="filterApplications()">
                <span id="resultCount" class="badge-type">${totalCount} başvuru gösteriliyor</span>
              </div>

              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Başvurulan İlan & Şirket</th>
                      <th>Aday</th>
                      <th>Durum</th>
                      <th>Özgeçmiş</th>
                      <th>Tarih</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody id="appTableBody">
                    ${rows}
                  </tbody>
                </table>
              </div>
            </section>

            <!-- CREATE APPLICATION FORM -->
            <section class="card-feature" id="new-app-form">
              <div class="card-title-row">
                <div>
                  <h2 class="card-heading">Yeni Başvuru Kaydı Oluştur</h2>
                  <p style="color: var(--steel); font-size: 13px; margin-top: 4px;">
                    Öğrenci veya mezun olarak mevcut bir iş ilanına doğrudan başvurun.
                  </p>
                </div>
                <span class="code-inline">POST /applications</span>
              </div>

              <form action="/applications" method="POST">
                <div class="form-grid" style="margin-bottom: 18px;">
                  <div class="form-group">
                    <label for="job_posting_id">Başvurulacak İlan *</label>
                    ${jobPostings.length > 0
                      ? `<select id="job_posting_id" name="job_posting_id" required>${jobOptions}</select>`
                      : `<input type="number" id="job_posting_id" name="job_posting_id" value="${currentJob ? currentJob.id : '1'}" required>`
                    }
                  </div>

                  <div class="form-group">
                    <label for="applicant_user_id">Başvuran Aday / Kullanıcı *</label>
                    ${users.length > 0
                      ? `<select id="applicant_user_id" name="applicant_user_id" required>${userOptions}</select>`
                      : `<input type="number" id="applicant_user_id" name="applicant_user_id" value="${currentUser ? currentUser.id : '12'}" required>`
                    }
                  </div>

                  <div class="form-group" style="grid-column: 1 / -1;">
                    <label for="resume_url">Özgeçmiş (CV) / Portfolyo Linki</label>
                    <input type="text" id="resume_url" name="resume_url" placeholder="https://linkedin.com/in/... veya https://drive.google.com/..." required>
                  </div>

                  <div class="form-group" style="grid-column: 1 / -1;">
                    <label for="cover_letter">Ön Yazı / Niyet Mektubu (Cover Letter)</label>
                    <textarea id="cover_letter" name="cover_letter" rows="4" placeholder="Neden bu pozisyona başvurduğunuzu ve yetkinliklerinizi özetleyen bir mesaj yazın..."></textarea>
                  </div>
                </div>

                <button type="submit" class="btn btn-primary">Başvuruyu Gönder</button>
              </form>
            </section>
          </div>
        </main>

        ${MintlifyTheme.renderFooter()}

        <script>
          function filterApplications() {
            const query = document.getElementById('appSearch').value.toLowerCase();
            const rows = document.querySelectorAll('.app-row');
            let visible = 0;
            rows.forEach(function(r) {
              const text = r.getAttribute('data-search') || '';
              if (text.includes(query)) {
                r.style.display = '';
                visible++;
              } else {
                r.style.display = 'none';
              }
            });
            document.getElementById('resultCount').textContent = visible + ' başvuru gösteriliyor';
          }
        </script>
      </body>
      </html>
    `;
  },

  /**
   * 2. READ ONE - Render Application Detail Page
   */
  renderApplicationDetailPage(app) {
    const badge = getStatusBadge(app.status);

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Başvuru Detayı #${app.id} — İÜ YBS</title>
        <style>
          ${MintlifyTheme.getBaseStyles()}
          .meta-two-col {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin: 20px 0;
          }
          .meta-box {
            background-color: var(--surface-soft);
            border: 1px solid var(--hairline);
            border-radius: var(--rounded-md);
            padding: 18px;
          }
          @media (max-width: 700px) {
            .meta-two-col { grid-template-columns: 1fr; }
          }
        </style>
      </head>
      <body>
        ${MintlifyTheme.renderHeader('applications')}

        <main class="page-main">
          <div class="page-container" style="max-width: 920px;">
            <div style="margin-bottom: 18px;">
              <a href="/applications" class="btn btn-secondary btn-sm">← Tüm Başvurulara Dön</a>
            </div>

            <div class="card-base">
              <div class="card-title-row">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;">
                    <span class="code-inline">Başvuru #${app.id}</span>
                    <span class="${badge.cls}">${escapeHtml(badge.label)}</span>
                  </div>
                  <h1 class="page-title">${escapeHtml(app.jobTitle || 'İlan #' + app.job_posting_id)}</h1>
                  <div style="font-size: 16px; color: var(--steel); font-weight: 500; margin-top: 4px;">
                    ${escapeHtml(app.jobCompany || '-')}
                  </div>
                </div>

                <div class="action-cells">
                  <a href="/applications/${app.id}/edit" class="btn btn-warn btn-sm">Düzenle</a>
                  <form action="/applications/${app.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('Bu başvuruyu silmek istediğinizden emin misiniz?');">
                    <button type="submit" class="btn btn-danger btn-sm">Sil</button>
                  </form>
                </div>
              </div>

              <div class="meta-two-col">
                <div class="meta-box">
                  <div style="font-size: 11px; color: var(--steel); text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 8px;">İlan Bilgileri</div>
                  <div style="font-weight: 600; font-size: 15px; color: var(--ink);">${escapeHtml(app.jobTitle || 'İlan #' + app.job_posting_id)}</div>
                  <div style="color: var(--steel); font-size: 13px; margin-top: 3px;">${escapeHtml(app.jobCompany || '-')}</div>
                  <div class="action-cells" style="margin-top: 14px;">
                    <a href="/job-postings/${app.job_posting_id}" class="btn btn-secondary btn-sm">İlanı Görüntüle</a>
                    <a href="/job-postings/${app.job_posting_id}/applications" class="btn btn-nested btn-sm">İlan Başvuruları</a>
                  </div>
                </div>

                <div class="meta-box">
                  <div style="font-size: 11px; color: var(--steel); text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 8px;">Aday Bilgileri</div>
                  <div style="font-weight: 600; font-size: 15px; color: var(--ink);">${escapeHtml(app.applicantName || 'Aday #' + app.applicant_user_id)}</div>
                  <div style="color: var(--steel); font-size: 13px; margin-top: 3px;">${escapeHtml(app.applicantEmail || 'Belirtilmedi')}</div>
                  <div class="action-cells" style="margin-top: 14px;">
                    <a href="/users/${app.applicant_user_id}" class="btn btn-secondary btn-sm">Aday Profili</a>
                    <a href="/users/${app.applicant_user_id}/applications" class="btn btn-nested btn-sm">Diğer Başvuruları</a>
                  </div>
                </div>
              </div>

              <div class="route-info" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div>
                  <strong>Özgeçmiş (CV) / Portfolyo:</strong>
                  ${app.resume_url
                    ? `<a href="${escapeHtml(app.resume_url)}" target="_blank" style="color: var(--brand-annotate); margin-left: 6px; font-weight: 500; word-break: break-all;">${escapeHtml(app.resume_url)} ↗</a>`
                    : '<span style="color: var(--stone); margin-left: 6px;">Eklenmemiş</span>'
                  }
                </div>
                <span style="font-size: 13px; color: var(--steel);">
                  Tarih: <strong>${app.created_at ? new Date(app.created_at).toLocaleString('tr-TR') : '-'}</strong>
                </span>
              </div>

              <h2 class="card-heading" style="margin: 20px 0 10px;">Ön Yazı (Cover Letter)</h2>
              <div style="background: var(--surface-soft); padding: 18px; border-radius: var(--rounded-md); border: 1px solid var(--hairline); color: var(--charcoal); line-height: 1.7; white-space: pre-wrap; font-size: 14px;">
                ${app.cover_letter ? escapeHtml(app.cover_letter) : '<span style="color: var(--stone); font-style: italic;">Aday herhangi bir ön yazı eklemedi.</span>'}
              </div>

              <div class="card-feature" style="margin-top: 24px; margin-bottom: 0;">
                <h3 style="font-size: 14px; font-weight: 600; color: var(--ink); margin-bottom: 12px;">Hızlı Durum Güncelle</h3>
                <div class="action-cells">
                  <form action="/applications/${app.id}/update" method="POST" style="display:inline;">
                    <input type="hidden" name="status" value="pending">
                    <button type="submit" class="btn btn-warn btn-sm">Beklemeye Al (pending)</button>
                  </form>
                  <form action="/applications/${app.id}/update" method="POST" style="display:inline;">
                    <input type="hidden" name="status" value="under_review">
                    <button type="submit" class="btn btn-nested btn-sm">İncelemeye Al (under_review)</button>
                  </form>
                  <form action="/applications/${app.id}/update" method="POST" style="display:inline;">
                    <input type="hidden" name="status" value="accepted">
                    <button type="submit" class="btn btn-accent-green btn-sm">Kabul Et (accepted)</button>
                  </form>
                  <form action="/applications/${app.id}/update" method="POST" style="display:inline;">
                    <input type="hidden" name="status" value="rejected">
                    <button type="submit" class="btn btn-danger btn-sm">Reddet (rejected)</button>
                  </form>
                </div>
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
   * 3. EDIT FORM - Render Edit Application Form
   */
  renderEditForm(app) {
    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Başvuruyu Düzenle — #${app.id} | İÜ YBS</title>
        <style>
          ${MintlifyTheme.getBaseStyles()}
        </style>
      </head>
      <body>
        ${MintlifyTheme.renderHeader('applications')}

        <main class="page-main">
          <div class="page-container" style="max-width: 720px;">
            <div style="margin-bottom: 18px;">
              <a href="/applications/${app.id}" class="btn btn-secondary btn-sm">← İptal / Başvuru Detayına Dön</a>
            </div>

            <div class="card-base">
              <div class="card-title-row">
                <h1 class="card-heading">Başvuru Durumunu Güncelle</h1>
                <span class="code-inline">#${app.id}</span>
              </div>

              <div class="route-info">
                <div><strong>İlan:</strong> ${escapeHtml(app.jobTitle || 'İlan #' + app.job_posting_id)} (${escapeHtml(app.jobCompany || '-')})</div>
                <div style="margin-top: 4px;"><strong>Aday:</strong> ${escapeHtml(app.applicantName || 'Aday #' + app.applicant_user_id)} (${escapeHtml(app.applicantEmail || '')})</div>
              </div>

              <form action="/applications/${app.id}/update" method="POST">
                <div class="form-group" style="margin-bottom: 16px;">
                  <label for="status">Başvuru Durumu *</label>
                  <select id="status" name="status" required>
                    <option value="pending" ${app.status === 'pending' ? 'selected' : ''}>Beklemede (pending)</option>
                    <option value="under_review" ${app.status === 'under_review' ? 'selected' : ''}>İnceleniyor (under_review)</option>
                    <option value="accepted" ${app.status === 'accepted' ? 'selected' : ''}>Kabul Edildi (accepted)</option>
                    <option value="rejected" ${app.status === 'rejected' ? 'selected' : ''}>Reddedildi (rejected)</option>
                    <option value="withdrawn" ${app.status === 'withdrawn' ? 'selected' : ''}>Geri Çekildi (withdrawn)</option>
                  </select>
                </div>

                <div class="form-group" style="margin-bottom: 16px;">
                  <label for="resume_url">Özgeçmiş (CV) / Portfolyo Linki</label>
                  <input type="text" id="resume_url" name="resume_url" value="${escapeHtml(app.resume_url || '')}">
                </div>

                <div class="form-group" style="margin-bottom: 24px;">
                  <label for="cover_letter">Ön Yazı / Niyet Mektubu</label>
                  <textarea id="cover_letter" name="cover_letter" rows="5">${escapeHtml(app.cover_letter || '')}</textarea>
                </div>

                <div class="action-cells">
                  <button type="submit" class="btn btn-primary">Değişiklikleri Kaydet</button>
                  <a href="/applications/${app.id}" class="btn btn-secondary">İptal</a>
                </div>
              </form>
            </div>
          </div>
        </main>

        ${MintlifyTheme.renderFooter()}
      </body>
      </html>
    `;
  }
};

module.exports = ApplicationViews;
