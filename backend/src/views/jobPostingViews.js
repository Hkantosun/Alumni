/**
 * Job Posting View Layer - Responsible for generating HTML representations for Job Posting Web Pages.
 * Styled consistently with DESIGN.md (Mintlify Design System) via MintlifyTheme.
 * Supports:
 *   - Direct Route: GET /job-postings (Read All)
 *   - Nested Route: GET /departments/:departmentId/job-postings (Filter by Department)
 *   - Nested Route: GET /users/:userId/job-postings (Filter by Poster)
 *   - Detail Route: GET /job-postings/:id (Read One)
 *   - Edit Form: GET /job-postings/:id/edit
 */

const MintlifyTheme = require('./mintlifyTheme');
const { escapeHtml } = MintlifyTheme;

function getJobTypeBadgeClass(jobType) {
  const t = (jobType || '').toLowerCase();
  if (t.includes('remote')) return 'badge-green';
  if (t.includes('intern')) return 'badge-tag';
  if (t.includes('part')) return 'badge-warn';
  return 'badge-type';
}

const JobPostingViews = {
  /**
   * 1. READ ALL - Render Job Postings List Page
   */
  renderJobPostingListPage(jobPostings, { departments = [], currentDepartment = null, currentUser = null, users = [] } = {}) {
    let headerTitle = 'İş & Staj İlanları';
    let bannerHtml = `
      <div class="route-info">
        <strong>Direct & Nested Rota Yapısı:</strong><br>
        • <strong>Direct Rota:</strong> <span class="code-inline">GET /job-postings</span> (Sistemdeki tüm kariyer ilanları listelenir)<br>
        • <strong>Nested Rotalar:</strong> <span class="code-inline">GET /departments/:departmentId/job-postings</span> veya <span class="code-inline">GET /users/:userId/job-postings</span>
      </div>
    `;

    if (currentDepartment) {
      headerTitle = `${escapeHtml(currentDepartment.name)} (${escapeHtml(currentDepartment.code)}) İlanları`;
      bannerHtml = `
        <div class="route-info nested-banner">
          <strong>Nested Route Aktif:</strong> <span class="code-inline">GET /departments/${currentDepartment.id}/job-postings</span><br>
          Şu anda yalnızca <strong>${escapeHtml(currentDepartment.name)}</strong> (${escapeHtml(currentDepartment.faculty)}) bölümüne hedeflenmiş ilanlar listelenmektedir.
          <a href="/job-postings" style="color: var(--brand-tag); margin-left: 10px; font-weight: 600;">Tüm İlanları Gör (Direct Route) →</a>
        </div>
      `;
    } else if (currentUser) {
      const authorName = `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || currentUser.email;
      headerTitle = `${escapeHtml(authorName)} Tarafından Paylaşılan İlanlar`;
      bannerHtml = `
        <div class="route-info nested-banner">
          <strong>Nested Route Aktif:</strong> <span class="code-inline">GET /users/${currentUser.id}/job-postings</span><br>
          Şu anda yalnızca <strong>${escapeHtml(authorName)}</strong> (${escapeHtml(currentUser.role)}) tarafından yayınlanmış ilanlar listelenmektedir.
          <a href="/job-postings" style="color: var(--brand-tag); margin-left: 10px; font-weight: 600;">Tüm İlanları Gör (Direct Route) →</a>
        </div>
      `;
    }

    const totalCount = jobPostings.length;
    const fullTimeCount = jobPostings.filter(j => j.job_type === 'Full-time').length;
    const internshipCount = jobPostings.filter(j => j.job_type === 'Internship').length;
    const remoteCount = jobPostings.filter(j => j.job_type === 'Remote' || (j.location && j.location.toLowerCase().includes('remote'))).length;

    const rows = jobPostings.length > 0
      ? jobPostings.map(j => {
          const appCount = j.applicationsCount !== undefined ? j.applicationsCount : 0;
          const badgeCls = getJobTypeBadgeClass(j.job_type);
          const searchAttr = escapeHtml(`${j.title} ${j.company} ${j.department_name || ''} ${j.job_type}`.toLowerCase());

          return `
            <tr class="job-row" data-search="${searchAttr}">
              <td><span class="code-inline">#${j.id}</span></td>
              <td>
                <a href="/job-postings/${j.id}" style="color: var(--ink); font-weight: 600; text-decoration: none; font-size: 14px;">
                  ${escapeHtml(j.title)}
                </a>
                <div style="font-size: 13px; color: var(--steel); margin-top: 2px;">
                  ${escapeHtml(j.company)}
                </div>
              </td>
              <td>
                ${j.department_id
                  ? `<a href="/departments/${j.department_id}/job-postings" class="badge-tag" style="text-decoration: none;" title="Bölüm ilanlarını filtrele">${escapeHtml(j.department_code || j.department_name)}</a>`
                  : '<span style="color: var(--stone); font-size: 13px;">Genel</span>'}
              </td>
              <td><span class="${badgeCls}">${escapeHtml(j.job_type)}</span></td>
              <td style="color: var(--steel); font-size: 13px;">${escapeHtml(j.location || 'Remote')}</td>
              <td>
                ${j.posted_by_user_id
                  ? `<a href="/users/${j.posted_by_user_id}/job-postings" style="color: var(--ink); font-weight: 500; text-decoration: none; font-size: 13px;" title="Kullanıcının ilanlarını gör">${escapeHtml(j.postedBy || 'Kullanıcı #' + j.posted_by_user_id)}</a>`
                  : '<span style="color: var(--stone); font-size: 13px;">Anonim</span>'}
              </td>
              <td>
                <a href="/job-postings/${j.id}/applications" class="btn btn-nested btn-sm" title="Bu ilana yapılan başvuruları incele">
                  ${appCount} Başvuru
                </a>
              </td>
              <td class="action-cells">
                <a href="/job-postings/${j.id}" class="btn btn-secondary btn-sm">Detay</a>
                <a href="/job-postings/${j.id}/edit" class="btn btn-warn btn-sm">Düzenle</a>
                <form action="/job-postings/${j.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('Bu iş ilanını silmek istediğinizden emin misiniz?');">
                  <button type="submit" class="btn btn-danger btn-sm">Sil</button>
                </form>
              </td>
            </tr>
          `;
        }).join('')
      : `<tr><td colspan="8" style="text-align: center; color: var(--steel); padding: 36px;">Henüz bu kriterlere uygun iş veya staj ilanı bulunmamaktadır.</td></tr>`;

    const deptOptions = departments.map(d => `
      <option value="${d.id}" ${currentDepartment && currentDepartment.id === d.id ? 'selected' : ''}>
        ${escapeHtml(d.code)} - ${escapeHtml(d.name)}
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
        ${MintlifyTheme.renderHeader('job-postings')}

        <main class="page-main">
          <div class="page-container">
            <div class="page-header-block">
              <div>
                <span class="section-kicker"><span class="mint-dot"></span> KARİYER FIRSATLARI</span>
                <h1 class="page-title">${headerTitle}</h1>
                <p class="page-subtitle">Mezunlarımız ve partner kurumlar tarafından açılan iş, staj ve uzaktan çalışma pozisyonları.</p>
              </div>
              <div class="action-cells">
                <a href="#new-job-form" class="btn btn-accent-green">+ Yeni İlan Oluştur</a>
                <a href="/api/job-postings" target="_blank" class="btn btn-secondary">JSON API ↗</a>
              </div>
            </div>

            <!-- Stats Grid -->
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-label">Toplam İlan</div>
                <div class="stat-value"><span class="mint-dot"></span> ${totalCount}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Tam Zamanlı</div>
                <div class="stat-value">${fullTimeCount}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Staj İmkanları</div>
                <div class="stat-value">${internshipCount}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Remote / Uzaktan</div>
                <div class="stat-value">${remoteCount}</div>
              </div>
            </div>

            <section class="card-base">
              ${bannerHtml}

              <div class="filter-bar">
                <input type="text" id="jobSearch" class="search-input" placeholder="İlan başlığı, şirket, bölüm veya pozisyon ara..." oninput="filterJobs()">
                <span id="resultCount" class="badge-type">${totalCount} ilan gösteriliyor</span>
              </div>

              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>İlan Başlığı & Şirket</th>
                      <th>Hedef Bölüm</th>
                      <th>Tür</th>
                      <th>Konum</th>
                      <th>Yayınlayan</th>
                      <th>Başvurular</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody id="jobTableBody">
                    ${rows}
                  </tbody>
                </table>
              </div>
            </section>

            <!-- CREATE JOB POSTING FORM -->
            <section class="card-feature" id="new-job-form">
              <div class="card-title-row">
                <div>
                  <h2 class="card-heading">Yeni İş / Staj İlanı Yayınla</h2>
                  <p style="color: var(--steel); font-size: 13px; margin-top: 4px;">
                    Mezun veya işveren olarak yeni bir pozisyon açın. Öğrenciler ve diğer mezunlar doğrudan başvurabilir.
                  </p>
                </div>
                <span class="code-inline">POST /job-postings</span>
              </div>

              <form action="/job-postings" method="POST">
                <div class="form-grid" style="margin-bottom: 18px;">
                  <div class="form-group">
                    <label for="title">İlan / Pozisyon Başlığı <span class="badge-error" style="margin-left: 6px;">ZORUNLU</span></label>
                    <input type="text" id="title" name="title" placeholder="Örn: Senior Frontend Developer" required>
                  </div>

                  <div class="form-group">
                    <label for="company">Şirket / Kurum Adı <span class="badge-error" style="margin-left: 6px;">ZORUNLU</span></label>
                    <input type="text" id="company" name="company" placeholder="Örn: Trendyol Tech" required>
                  </div>

                  <div class="form-group">
                    <label for="location">Konum / Şehir</label>
                    <input type="text" id="location" name="location" placeholder="İstanbul / Remote" value="Remote">
                  </div>

                  <div class="form-group">
                    <label for="job_type">Çalışma Şekli</label>
                    <select id="job_type" name="job_type">
                      <option value="Full-time">Tam Zamanlı (Full-time)</option>
                      <option value="Internship">Staj (Internship)</option>
                      <option value="Remote">Uzaktan (Remote)</option>
                      <option value="Part-time">Yarı Zamanlı (Part-time)</option>
                      <option value="Contract">Sözleşmeli (Contract)</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="department_id">Hedef Bölüm (İlişkili Bölüm)</label>
                    <select id="department_id" name="department_id">
                      <option value="">Genel (Tüm Bölümlere Açık)</option>
                      ${deptOptions}
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="posted_by_user_id">İlanı Yayınlayan Kullanıcı *</label>
                    ${users.length > 0
                      ? `<select id="posted_by_user_id" name="posted_by_user_id" required>${userOptions}</select>`
                      : `<input type="number" id="posted_by_user_id" name="posted_by_user_id" value="${currentUser ? currentUser.id : '1'}" required>`
                    }
                  </div>

                  <div class="form-group" style="grid-column: 1 / -1;">
                    <label for="application_link">Harici Başvuru Linki veya İletişim E-Postası (Opsiyonel)</label>
                    <input type="text" id="application_link" name="application_link" placeholder="https://careers.company.com/apply/123 veya ik@sirket.com">
                  </div>

                  <div class="form-group" style="grid-column: 1 / -1;">
                    <label for="description">Pozisyon Detayları, Yetkinlikler ve Aranan Kriterler *</label>
                    <textarea id="description" name="description" rows="4" placeholder="Pozisyon gereksinimleri, teknolojiler ve aranan kriterleri buraya giriniz..." required></textarea>
                  </div>
                </div>

                <button type="submit" class="btn btn-primary">İlanı Yayınla</button>
              </form>
            </section>
          </div>
        </main>

        ${MintlifyTheme.renderFooter()}

        <script>
          function filterJobs() {
            const query = document.getElementById('jobSearch').value.toLowerCase();
            const rows = document.querySelectorAll('.job-row');
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
            document.getElementById('resultCount').textContent = visible + ' ilan gösteriliyor';
          }
        </script>
      </body>
      </html>
    `;
  },

  /**
   * 2. READ ONE - Render Job Posting Detail Page
   */
  renderJobPostingDetailPage(job, { applications = [], users = [] } = {}) {
    const appCount = applications.length;
    const badgeCls = getJobTypeBadgeClass(job.job_type);

    const applicationRows = applications.length > 0
      ? applications.map(a => `
          <tr>
            <td><span class="code-inline">#${a.id}</span></td>
            <td>
              <a href="/users/${a.applicant_user_id}" style="color: var(--ink); font-weight: 600; text-decoration: none;">
                ${escapeHtml(a.applicantName || 'Aday #' + a.applicant_user_id)}
              </a>
              <div style="font-size: 12px; color: var(--steel);">${escapeHtml(a.applicantEmail || '')}</div>
            </td>
            <td><span class="badge-tag">${escapeHtml(a.status)}</span></td>
            <td>
              ${a.resume_url ? `<a href="${escapeHtml(a.resume_url)}" target="_blank" style="color: var(--brand-annotate); font-weight: 500; text-decoration: none;">CV Görüntüle ↗</a>` : '<span style="color: var(--stone);">Yok</span>'}
            </td>
            <td style="color: var(--steel); font-size: 13px;">${a.created_at ? new Date(a.created_at).toLocaleDateString('tr-TR') : '-'}</td>
            <td><a href="/applications/${a.id}" class="btn btn-secondary btn-sm">İncele</a></td>
          </tr>
        `).join('')
      : `<tr><td colspan="6" style="text-align: center; color: var(--steel); padding: 24px;">Bu ilana henüz başvuru yapılmadı. İlk başvuran siz olun!</td></tr>`;

    const userOptions = users.map(u => {
      const displayName = u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email;
      return `<option value="${u.id}">#${u.id} - ${escapeHtml(displayName)} (${escapeHtml(u.role)})</option>`;
    }).join('');

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${escapeHtml(job.title)} — ${escapeHtml(job.company)} | İÜ YBS</title>
        <style>
          ${MintlifyTheme.getBaseStyles()}
        </style>
      </head>
      <body>
        ${MintlifyTheme.renderHeader('job-postings')}

        <main class="page-main">
          <div class="page-container" style="max-width: 920px;">
            <div style="margin-bottom: 18px;">
              <a href="/job-postings" class="btn btn-secondary btn-sm">← Tüm İlanlara Dön</a>
            </div>

            <div class="card-base">
              <div class="card-title-row">
                <div>
                  <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 10px; flex-wrap: wrap;">
                    <span class="code-inline">#${job.id}</span>
                    <span class="${badgeCls}">${escapeHtml(job.job_type)}</span>
                    ${job.department_id
                      ? `<a href="/departments/${job.department_id}/job-postings" class="badge-tag" style="text-decoration: none;">${escapeHtml(job.department_code || job.department_name)}</a>`
                      : '<span class="badge-type">Genel İlan</span>'}
                    <span class="badge-type">📍 ${escapeHtml(job.location || 'Remote')}</span>
                  </div>
                  <h1 class="page-title">${escapeHtml(job.title)}</h1>
                  <div style="font-size: 16px; color: var(--steel); font-weight: 500; margin-top: 6px;">
                    ${escapeHtml(job.company)}
                  </div>
                </div>

                <div class="action-cells">
                  <a href="/job-postings/${job.id}/edit" class="btn btn-warn btn-sm">Düzenle</a>
                  <form action="/job-postings/${job.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('Bu ilanı silmek istediğinizden emin misiniz?');">
                    <button type="submit" class="btn btn-danger btn-sm">Sil</button>
                  </form>
                </div>
              </div>

              <div class="route-info" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div>
                  Yayınlayan:
                  <a href="/users/${job.posted_by_user_id}/job-postings" style="color: var(--ink); font-weight: 600; text-decoration: none;">
                    ${escapeHtml(job.postedBy || 'Kullanıcı #' + job.posted_by_user_id)}
                  </a>
                  ${job.poster_email ? `<span style="color: var(--steel);">(${escapeHtml(job.poster_email)})</span>` : ''}
                </div>
                <span style="font-size: 13px; color: var(--steel);">
                  Yayın Tarihi: <strong>${job.created_at ? new Date(job.created_at).toLocaleDateString('tr-TR') : '-'}</strong>
                </span>
              </div>

              <h2 class="card-heading" style="margin-bottom: 10px;">Pozisyon Detayları & Yetkinlikler</h2>
              <div style="line-height: 1.7; color: var(--charcoal); white-space: pre-wrap; font-size: 15px; margin-bottom: 24px;">${escapeHtml(job.description)}</div>

              <div class="action-cells">
                ${job.application_link ? `
                  <a href="${escapeHtml(job.application_link)}" target="_blank" class="btn btn-primary">Şirket Sayfasında Başvur ↗</a>
                ` : ''}
                <a href="#quick-apply" class="btn btn-accent-green">Sistem Üzerinden Başvur</a>
                <a href="/job-postings/${job.id}/applications" class="btn btn-nested">Başvuruları Gör (${appCount})</a>
              </div>
            </div>

            <!-- Quick In-App Application Form -->
            <section class="card-feature" id="quick-apply">
              <div class="card-title-row">
                <div>
                  <h2 class="card-heading">Bu İlana Doğrudan Başvur</h2>
                  <p style="color: var(--steel); font-size: 13px; margin-top: 4px;">
                    CV bağlantınızı ve kısa ön yazınızı bırakarak başvurunuzu sisteme kaydedin.
                  </p>
                </div>
                <span class="code-inline">POST /applications</span>
              </div>

              <form action="/applications" method="POST">
                <input type="hidden" name="job_posting_id" value="${job.id}">

                <div class="form-grid" style="margin-bottom: 18px;">
                  <div class="form-group" style="grid-column: 1 / -1;">
                    <label for="applicant_user_id">Aday / Başvuran Kullanıcı *</label>
                    ${users.length > 0
                      ? `<select id="applicant_user_id" name="applicant_user_id" required>${userOptions}</select>`
                      : `<input type="number" id="applicant_user_id" name="applicant_user_id" placeholder="Aday Kullanıcı ID" value="12" required>`
                    }
                  </div>

                  <div class="form-group" style="grid-column: 1 / -1;">
                    <label for="resume_url">Özgeçmiş (CV) / Portfolyo / LinkedIn Bağlantısı</label>
                    <input type="text" id="resume_url" name="resume_url" placeholder="https://linkedin.com/in/... veya https://drive.google.com/..." required>
                  </div>

                  <div class="form-group" style="grid-column: 1 / -1;">
                    <label for="cover_letter">Ön Yazı / Niyet Mektubu</label>
                    <textarea id="cover_letter" name="cover_letter" rows="3" placeholder="Bu pozisyon için neden uygun olduğunuzu kısaca açıklayınız..."></textarea>
                  </div>
                </div>

                <button type="submit" class="btn btn-primary">Başvuruyu Gönder</button>
              </form>
            </section>

            <!-- Existing Applications for this Job -->
            <section class="card-base">
              <div class="card-title-row">
                <h3 class="card-heading">Bu İlana Gelen Başvurular (${appCount})</h3>
                <a href="/job-postings/${job.id}/applications" class="btn btn-secondary btn-sm">Tam Listeyi Aç (Nested)</a>
              </div>

              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Aday</th>
                      <th>Durum</th>
                      <th>CV</th>
                      <th>Tarih</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${applicationRows}
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
   * 3. EDIT FORM - Render Edit Job Posting Form
   */
  renderEditForm(job, departments = []) {
    const deptOptions = departments.map(d => `
      <option value="${d.id}" ${job.department_id === d.id ? 'selected' : ''}>
        ${escapeHtml(d.code)} - ${escapeHtml(d.name)}
      </option>
    `).join('');

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>İlanı Düzenle — #${job.id} | İÜ YBS</title>
        <style>
          ${MintlifyTheme.getBaseStyles()}
        </style>
      </head>
      <body>
        ${MintlifyTheme.renderHeader('job-postings')}

        <main class="page-main">
          <div class="page-container" style="max-width: 820px;">
            <div style="margin-bottom: 18px;">
              <a href="/job-postings/${job.id}" class="btn btn-secondary btn-sm">← İptal / İlan Detayına Dön</a>
            </div>

            <div class="card-base">
              <div class="card-title-row">
                <h1 class="card-heading">İlanı Düzenle</h1>
                <span class="code-inline">#${job.id}</span>
              </div>

              <form action="/job-postings/${job.id}/update" method="POST">
                <div class="form-grid" style="margin-bottom: 20px;">
                  <div class="form-group" style="grid-column: 1 / -1;">
                    <label for="title">İlan / Pozisyon Başlığı *</label>
                    <input type="text" id="title" name="title" value="${escapeHtml(job.title)}" required>
                  </div>

                  <div class="form-group">
                    <label for="company">Şirket / Kurum Adı *</label>
                    <input type="text" id="company" name="company" value="${escapeHtml(job.company)}" required>
                  </div>

                  <div class="form-group">
                    <label for="location">Konum / Şehir</label>
                    <input type="text" id="location" name="location" value="${escapeHtml(job.location || 'Remote')}">
                  </div>

                  <div class="form-group">
                    <label for="job_type">Çalışma Şekli</label>
                    <select id="job_type" name="job_type">
                      <option value="Full-time" ${job.job_type === 'Full-time' ? 'selected' : ''}>Tam Zamanlı (Full-time)</option>
                      <option value="Internship" ${job.job_type === 'Internship' ? 'selected' : ''}>Staj (Internship)</option>
                      <option value="Remote" ${job.job_type === 'Remote' ? 'selected' : ''}>Uzaktan (Remote)</option>
                      <option value="Part-time" ${job.job_type === 'Part-time' ? 'selected' : ''}>Yarı Zamanlı (Part-time)</option>
                      <option value="Contract" ${job.job_type === 'Contract' ? 'selected' : ''}>Sözleşmeli (Contract)</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="department_id">Hedef Bölüm</label>
                    <select id="department_id" name="department_id">
                      <option value="">Genel (Tüm Bölümler)</option>
                      ${deptOptions}
                    </select>
                  </div>

                  <div class="form-group" style="grid-column: 1 / -1;">
                    <label for="application_link">Harici Başvuru Bağlantısı</label>
                    <input type="text" id="application_link" name="application_link" value="${escapeHtml(job.application_link || '')}">
                  </div>

                  <div class="form-group" style="grid-column: 1 / -1;">
                    <label for="description">İlan Açıklaması ve Kriterler *</label>
                    <textarea id="description" name="description" rows="6" required>${escapeHtml(job.description)}</textarea>
                  </div>
                </div>

                <div class="action-cells">
                  <button type="submit" class="btn btn-primary">Değişiklikleri Kaydet</button>
                  <a href="/job-postings/${job.id}" class="btn btn-secondary">İptal</a>
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

module.exports = JobPostingViews;
