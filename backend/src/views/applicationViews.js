/**
 * Application View Layer - Responsible for generating HTML representations for Application Web Pages.
 * Supports:
 *   - Direct Route: GET /applications
 *   - Nested Route: GET /job-postings/:jobPostingId/applications
 *   - Nested Route: GET /users/:userId/applications
 *   - Detail Route: GET /applications/:id
 *   - Edit Form: GET /applications/:id/edit
 */

function getSharedStyles() {
  return `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
      :root {
        --bg: #0b0f19;
        --surface: #111827;
        --card-bg: #1e293b;
        --card-bg-hover: #243247;
        --accent: #38bdf8;
        --accent-hover: #0284c7;
        --accent-glow: rgba(56, 189, 248, 0.2);
        --purple: #a855f7;
        --purple-glow: rgba(168, 85, 247, 0.2);
        --success: #10b981;
        --success-glow: rgba(16, 185, 129, 0.2);
        --warning: #f59e0b;
        --warning-glow: rgba(245, 158, 11, 0.2);
        --danger: #ef4444;
        --danger-glow: rgba(239, 68, 68, 0.2);
        --text: #f8fafc;
        --muted: #94a3b8;
        --border: #334155;
      }
      * { box-sizing: border-box; }
      body {
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        background-color: var(--bg);
        color: var(--text);
        margin: 0;
        padding: 2rem 1rem;
        line-height: 1.5;
      }
      .container { max-width: 1200px; margin: 0 auto; }
      .nav-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--surface);
        padding: 1rem 1.5rem;
        border-radius: 14px;
        margin-bottom: 2rem;
        border: 1px solid var(--border);
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
        flex-wrap: wrap;
        gap: 1rem;
      }
      .nav-brand {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        font-weight: 800;
        font-size: 1.25rem;
        background: linear-gradient(135deg, #38bdf8, #818cf8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-decoration: none;
      }
      .nav-links {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      .nav-links a {
        color: var(--muted);
        text-decoration: none;
        padding: 0.5rem 0.85rem;
        border-radius: 8px;
        font-weight: 500;
        font-size: 0.9rem;
        transition: all 0.2s ease;
      }
      .nav-links a:hover {
        background: var(--card-bg);
        color: var(--text);
      }
      .nav-links a.active {
        background: rgba(56, 189, 248, 0.15);
        color: var(--accent);
        border: 1px solid rgba(56, 189, 248, 0.3);
      }
      .card {
        background-color: var(--card-bg);
        border-radius: 14px;
        padding: 1.75rem;
        border: 1px solid var(--border);
        margin-bottom: 2rem;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
      }
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
      }
      .stat-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 1.2rem;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
      }
      .stat-label { font-size: 0.8rem; color: var(--muted); text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; }
      .stat-value { font-size: 1.8rem; font-weight: 800; color: var(--text); }
      .route-info {
        background: rgba(56, 189, 248, 0.08);
        border-left: 4px solid var(--accent);
        padding: 1rem 1.25rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        font-size: 0.95rem;
        line-height: 1.6;
      }
      .nested-banner {
        background: rgba(168, 85, 247, 0.12);
        border-left: 4px solid var(--purple);
      }
      .filter-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.25rem;
        flex-wrap: wrap;
      }
      .search-input {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 0.65rem 1rem;
        color: var(--text);
        font-size: 0.9rem;
        flex: 1;
        min-width: 260px;
      }
      .search-input:focus {
        outline: none;
        border-color: var(--accent);
        box-shadow: 0 0 0 2px var(--accent-glow);
      }
      table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; }
      th, td { text-align: left; padding: 1rem; border-bottom: 1px solid var(--border); font-size: 0.92rem; }
      th { background-color: var(--surface); color: var(--muted); font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; }
      tr:hover td { background-color: rgba(255, 255, 255, 0.02); }
      .id-badge { background: #334155; padding: 0.2rem 0.55rem; border-radius: 6px; font-size: 0.8rem; color: #cbd5e1; font-family: monospace; }
      .status-badge {
        padding: 0.3rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: capitalize;
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
      }
      .status-pending { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
      .status-under_review { background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }
      .status-accepted { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
      .status-rejected { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
      .status-withdrawn { background: rgba(148, 163, 184, 0.15); color: #94a3b8; border: 1px solid rgba(148, 163, 184, 0.3); }
      .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        padding: 0.45rem 0.8rem;
        border-radius: 8px;
        text-decoration: none;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.2s ease;
      }
      .btn:hover { transform: translateY(-1px); }
      .btn-view { background: #334155; color: #f8fafc; }
      .btn-view:hover { background: #475569; }
      .btn-edit { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
      .btn-edit:hover { background: rgba(245, 158, 11, 0.25); }
      .btn-delete { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
      .btn-delete:hover { background: rgba(239, 68, 68, 0.25); }
      .btn-primary { background: var(--accent); color: #0b0f19; font-weight: 700; }
      .btn-primary:hover { background: var(--accent-hover); }
      .btn-back { background: var(--surface); color: var(--muted); border: 1px solid var(--border); margin-bottom: 1.5rem; }
      .btn-back:hover { color: var(--text); border-color: var(--muted); }
      .action-cells { display: flex; gap: 0.4rem; align-items: center; }
      .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-top: 1rem; }
      .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
      .form-group label { font-size: 0.85rem; color: var(--muted); font-weight: 600; }
      .form-group input, .form-group select, .form-group textarea {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 0.7rem 0.9rem;
        color: var(--text);
        font-size: 0.92rem;
        font-family: inherit;
        transition: border-color 0.2s;
      }
      .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
        outline: none;
        border-color: var(--accent);
        box-shadow: 0 0 0 2px var(--accent-glow);
      }
      .btn-submit {
        background: linear-gradient(135deg, #38bdf8, #2563eb);
        color: #ffffff;
        font-weight: 700;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        border: none;
        margin-top: 1.25rem;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.95rem;
        box-shadow: 0 4px 15px rgba(56, 189, 248, 0.3);
        transition: all 0.2s ease;
      }
      .btn-submit:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(56, 189, 248, 0.4);
      }
    </style>
  `;
}

function renderNavbar(activeItem = 'applications') {
  return `
    <header class="nav-bar">
      <a href="/home" class="nav-brand">🎓 Alumni Tracking System</a>
      <nav class="nav-links">
        <a href="/home" class="${activeItem === 'home' ? 'active' : ''}">🏠 Ana Sayfa</a>
        <a href="/users" class="${activeItem === 'users' ? 'active' : ''}">👥 Kullanıcılar</a>
        <a href="/departments" class="${activeItem === 'departments' ? 'active' : ''}">🏛️ Bölümler</a>
        <a href="/job-postings" class="${activeItem === 'job-postings' ? 'active' : ''}">💼 İlanlar</a>
        <a href="/applications" class="${activeItem === 'applications' ? 'active' : ''}">📄 Başvurular</a>
        <a href="/announcements" class="${activeItem === 'announcements' ? 'active' : ''}">📢 Duyurular</a>
        <a href="/api/swagger" target="_blank" style="color: #38bdf8; font-weight: 700;">⚡ Swagger API</a>
      </nav>
    </header>
  `;
}

const ApplicationViews = {
  /**
   * 1. READ ALL - Render Application List Page (Direct & Nested)
   */
  renderApplicationListPage(applications, { currentJob = null, currentUser = null, jobPostings = [], users = [], isNested = false } = {}) {
    let headerTitle = '📄 İş & Staj Başvuruları';
    let bannerHtml = `
      <div class="route-info">
        💡 <strong>Direct Rota:</strong> <code>GET /applications</code> (Sistemdeki tüm iş/staj başvuruları listelenir).<br>
        • Belirli bir ilana ait başvuruları görmek için <strong>Nested Rota:</strong> <code>GET /job-postings/:jobPostingId/applications</code><br>
        • Belirli bir adayın başvurularını görmek için <strong>Nested Rota:</strong> <code>GET /users/:userId/applications</code>
      </div>
    `;

    if (currentJob) {
      headerTitle = `📄 "${currentJob.title}" İlanına Yapılan Başvurular`;
      bannerHtml = `
        <div class="route-info nested-banner">
          🔗 <strong>Nested Route Aktif:</strong> <code>GET /job-postings/${currentJob.id}/applications</code><br>
          Şu anda yalnızca <strong>${currentJob.company}</strong> bünyesindeki <strong>${currentJob.title}</strong> ilanına ait başvurular listelenmektedir.
          <a href="/job-postings/${currentJob.id}" style="color: #c084fc; margin-left: 0.75rem; text-decoration: underline; font-weight: 600;">İlanı Görüntüle</a>
          <a href="/applications" style="color: #38bdf8; margin-left: 0.75rem; text-decoration: underline; font-weight: 600;">Tüm Başvuruları Gör (Direct Route)</a>
        </div>
      `;
    } else if (currentUser) {
      const applicantName = `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || currentUser.email;
      headerTitle = `📄 ${applicantName} Tarafından Yapılan Başvurular`;
      bannerHtml = `
        <div class="route-info nested-banner">
          🔗 <strong>Nested Route Aktif:</strong> <code>GET /users/${currentUser.id}/applications</code><br>
          Şu anda yalnızca <strong>${applicantName}</strong> (${currentUser.role}) adayının yaptığı başvurular listelenmektedir.
          <a href="/applications" style="color: #38bdf8; margin-left: 1rem; text-decoration: underline; font-weight: 600;">Tüm Başvuruları Gör (Direct Route)</a>
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
          let statusBadgeClass = 'status-pending';
          let statusIcon = '⏳';
          if (a.status === 'accepted') { statusBadgeClass = 'status-accepted'; statusIcon = '✅'; }
          if (a.status === 'rejected') { statusBadgeClass = 'status-rejected'; statusIcon = '❌'; }
          if (a.status === 'under_review') { statusBadgeClass = 'status-under_review'; statusIcon = '🔍'; }
          if (a.status === 'withdrawn') { statusBadgeClass = 'status-withdrawn'; statusIcon = '⚪'; }

          return `
            <tr class="app-row" data-search="${((a.jobTitle || '') + ' ' + (a.jobCompany || '') + ' ' + (a.applicantName || '') + ' ' + (a.applicantEmail || '') + ' ' + a.status).toLowerCase()}">
              <td><span class="id-badge">#${a.id}</span></td>
              <td>
                <a href="/job-postings/${a.job_posting_id}" style="color: #f8fafc; font-weight: 700; text-decoration: none;">
                  💼 ${a.jobTitle || 'İlan #' + a.job_posting_id}
                </a>
                <div style="font-size: 0.85rem; color: #94a3b8; margin-top: 0.2rem;">
                  🏢 ${a.jobCompany || '-'}
                </div>
              </td>
              <td>
                <a href="/users/${a.applicant_user_id}" style="color: #38bdf8; text-decoration: none; font-weight: 600;">
                  👤 ${a.applicantName || 'Aday #' + a.applicant_user_id}
                </a>
                <div style="font-size: 0.8rem; color: #64748b;">${a.applicantEmail || ''}</div>
              </td>
              <td>
                <span class="status-badge ${statusBadgeClass}">${statusIcon} ${a.status}</span>
              </td>
              <td>
                ${a.resume_url
                  ? `<a href="${a.resume_url}" target="_blank" class="btn" style="background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 0.8rem; padding: 0.3rem 0.6rem;">📄 CV Aç</a>`
                  : '<span style="color: #64748b; font-size: 0.85rem;">CV Yok</span>'
                }
              </td>
              <td style="color: #94a3b8; font-size: 0.85rem;">
                ${new Date(a.created_at).toLocaleDateString('tr-TR')}
              </td>
              <td class="action-cells">
                <a href="/applications/${a.id}" class="btn btn-view" title="Detay">👁️ Detay</a>
                <a href="/applications/${a.id}/edit" class="btn btn-edit" title="Durum Güncelle">✏️ Durum</a>
                <form action="/applications/${a.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('Bu başvuruyu silmek istediğinizden emin misiniz?');">
                  <button type="submit" class="btn btn-delete" title="Sil">🗑️</button>
                </form>
              </td>
            </tr>
          `;
        }).join('')
      : `<tr><td colspan="7" style="text-align: center; color: #94a3b8; padding: 3rem;">Henüz kayıtlı başvuru bulunmamaktadır.</td></tr>`;

    const jobOptions = jobPostings.map(j => `
      <option value="${j.id}" ${currentJob && currentJob.id === j.id ? 'selected' : ''}>
        #${j.id} - ${j.title} (${j.company})
      </option>
    `).join('');

    const userOptions = users.map(u => {
      const displayName = u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email;
      return `<option value="${u.id}" ${currentUser && currentUser.id === u.id ? 'selected' : ''}>#${u.id} - ${displayName} (${u.role})</option>`;
    }).join('');

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${headerTitle} - Alumni System</title>
        ${getSharedStyles()}
      </head>
      <body>
        <div class="container">
          ${renderNavbar('applications')}

          <!-- Stats Grid -->
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-label">Toplam Başvuru</span>
              <span class="stat-value" style="color: #38bdf8;">${totalCount}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Beklemede (Pending)</span>
              <span class="stat-value" style="color: #fbbf24;">${pendingCount}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">İnceleniyor (Review)</span>
              <span class="stat-value" style="color: #818cf8;">${reviewCount}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Kabul Edildi (Accepted)</span>
              <span class="stat-value" style="color: #34d399;">${acceptedCount}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Reddedildi (Rejected)</span>
              <span class="stat-value" style="color: #f87171;">${rejectedCount}</span>
            </div>
          </div>

          <main class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
              <h1 style="margin: 0; font-size: 1.75rem;">${headerTitle}</h1>
              <a href="#new-app-form" class="btn btn-primary" style="padding: 0.6rem 1.1rem;">➕ Yeni Başvuru Gönder</a>
            </div>

            ${bannerHtml}

            <!-- Live Filter / Search Bar -->
            <div class="filter-bar">
              <input type="text" id="appSearch" class="search-input" placeholder="🔍 İlan adı, şirket, aday adı veya durum ara..." oninput="filterApplications()">
              <span id="resultCount" style="color: var(--muted); font-size: 0.85rem;">${totalCount} başvuru gösteriliyor</span>
            </div>

            <div style="overflow-x: auto;">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Başvurulan İlan & Şirket</th>
                    <th>Aday (Applicant)</th>
                    <th>Durum</th>
                    <th>Özgeçmiş</th>
                    <th>Başvuru Tarihi</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody id="appTableBody">
                  ${rows}
                </tbody>
              </table>
            </div>
          </main>

          <!-- CREATE APPLICATION FORM -->
          <section class="card" id="new-app-form">
            <h2 style="margin-top: 0; font-size: 1.4rem;">➕ Yeni Başvuru Kaydı Oluştur</h2>
            <p style="color: var(--muted); margin-top: -0.5rem; margin-bottom: 1.5rem; font-size: 0.9rem;">
              Öğrenci veya mezun olarak mevcut bir iş ilanına doğrudan başvurun veya yönetici olarak başvuru kaydı ekleyin.
            </p>

            <form action="/applications" method="POST">
              <div class="form-grid">
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

              <button type="submit" class="btn-submit">📨 Başvuruyu Gönder</button>
            </form>
          </section>
        </div>

        <script>
          function filterApplications() {
            const query = document.getElementById('appSearch').value.toLowerCase();
            const rows = document.querySelectorAll('.app-row');
            let visible = 0;
            rows.forEach(r => {
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
    let statusBadgeClass = 'status-pending';
    let statusIcon = '⏳';
    if (app.status === 'accepted') { statusBadgeClass = 'status-accepted'; statusIcon = '✅'; }
    if (app.status === 'rejected') { statusBadgeClass = 'status-rejected'; statusIcon = '❌'; }
    if (app.status === 'under_review') { statusBadgeClass = 'status-under_review'; statusIcon = '🔍'; }
    if (app.status === 'withdrawn') { statusBadgeClass = 'status-withdrawn'; statusIcon = '⚪'; }

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Başvuru Detayı #${app.id} - Alumni System</title>
        ${getSharedStyles()}
      </head>
      <body>
        <div class="container" style="max-width: 900px;">
          ${renderNavbar('applications')}

          <a href="/applications" class="btn btn-back">⬅️ Tüm Başvurulara Dön (Direct Route)</a>

          <!-- Main Application Detail Card -->
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap;">
              <div>
                <span class="id-badge" style="font-size: 0.9rem;">Başvuru #${app.id}</span>
                <span class="status-badge ${statusBadgeClass}" style="margin-left: 0.5rem; font-size: 0.9rem; padding: 0.35rem 0.85rem;">
                  ${statusIcon} ${app.status}
                </span>
                <h1 style="margin: 0.75rem 0 0 0; font-size: 1.8rem;">
                  ${app.jobTitle || 'İlan #' + app.job_posting_id}
                </h1>
                <div style="font-size: 1.1rem; color: #38bdf8; font-weight: 600; margin-top: 0.3rem;">
                  🏢 ${app.jobCompany || '-'}
                </div>
              </div>

              <div style="display: flex; gap: 0.5rem;">
                <a href="/applications/${app.id}/edit" class="btn btn-edit">✏️ Düzenle</a>
                <form action="/applications/${app.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('Bu başvuruyu silmek istediğinizden emin misiniz?');">
                  <button type="submit" class="btn btn-delete">🗑️ Sil</button>
                </form>
              </div>
            </div>

            <!-- Two-Column Meta Info -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1.75rem;">
              <!-- Job Box -->
              <div style="background: var(--surface); padding: 1.25rem; border-radius: 10px; border: 1px solid var(--border);">
                <div style="font-size: 0.8rem; color: var(--muted); text-transform: uppercase; font-weight: 700; margin-bottom: 0.5rem;">
                  💼 İlan Bilgileri
                </div>
                <div style="font-weight: 700; font-size: 1.05rem;">${app.jobTitle}</div>
                <div style="color: var(--muted); font-size: 0.9rem; margin-top: 0.2rem;">🏢 ${app.jobCompany}</div>
                <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                  <a href="/job-postings/${app.job_posting_id}" class="btn btn-view" style="font-size: 0.8rem;">
                    👁️ İlanı Görüntüle
                  </a>
                  <a href="/job-postings/${app.job_posting_id}/applications" class="btn" style="background: rgba(168, 85, 247, 0.2); color: #c084fc; font-size: 0.8rem;">
                    🔗 İlan Başvuruları (Nested)
                  </a>
                </div>
              </div>

              <!-- Applicant Box -->
              <div style="background: var(--surface); padding: 1.25rem; border-radius: 10px; border: 1px solid var(--border);">
                <div style="font-size: 0.8rem; color: var(--muted); text-transform: uppercase; font-weight: 700; margin-bottom: 0.5rem;">
                  👤 Aday Bilgileri
                </div>
                <div style="font-weight: 700; font-size: 1.05rem;">${app.applicantName || 'Aday #' + app.applicant_user_id}</div>
                <div style="color: var(--muted); font-size: 0.9rem; margin-top: 0.2rem;">✉️ ${app.applicantEmail || 'Belirtilmedi'}</div>
                <div style="margin-top: 1rem;">
                  <a href="/users/${app.applicant_user_id}" class="btn btn-view" style="font-size: 0.8rem;">
                    👤 Aday Profilini Aç
                  </a>
                  <a href="/users/${app.applicant_user_id}/applications" class="btn" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; font-size: 0.8rem; margin-left: 0.3rem;">
                    📄 Adayın Diğer Başvuruları
                  </a>
                </div>
              </div>
            </div>

            <!-- Resume Link -->
            <div style="margin-top: 1.5rem; background: var(--surface); padding: 1rem 1.25rem; border-radius: 10px; border: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
              <div>
                📄 <strong>Özgeçmiş (CV) / Portfolyo:</strong>
                ${app.resume_url 
                  ? `<a href="${app.resume_url}" target="_blank" style="color: #34d399; margin-left: 0.5rem; text-decoration: underline; word-break: break-all;">${app.resume_url}</a>`
                  : '<span style="color: #64748b; margin-left: 0.5rem;">Eklenmemiş</span>'
                }
              </div>
              <div style="color: var(--muted); font-size: 0.85rem;">
                📅 Başvuru Tarihi: <strong>${new Date(app.created_at).toLocaleString('tr-TR')}</strong>
              </div>
            </div>

            <!-- Cover Letter -->
            <h3 style="margin-top: 2rem; margin-bottom: 0.75rem; font-size: 1.2rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem;">
              ✉️ Ön Yazı (Cover Letter)
            </h3>
            <div style="background: var(--surface); padding: 1.25rem; border-radius: 10px; border: 1px solid var(--border); color: #cbd5e1; line-height: 1.8; white-space: pre-wrap; font-size: 0.95rem;">
              ${app.cover_letter || '<span style="color: #64748b; font-style: italic;">Aday herhangi bir ön yazı eklemedi.</span>'}
            </div>

            <!-- Quick Status Updater Buttons -->
            <div style="margin-top: 2rem; padding: 1.25rem; background: rgba(56, 189, 248, 0.05); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 10px;">
              <h4 style="margin: 0 0 0.75rem 0; font-size: 1rem; color: #38bdf8;">⚡ Hızlı Durum Değiştir</h4>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <form action="/applications/${app.id}/update" method="POST" style="display:inline;">
                  <input type="hidden" name="status" value="pending">
                  <button type="submit" class="btn" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4);">
                    ⏳ Beklemeye Al (pending)
                  </button>
                </form>

                <form action="/applications/${app.id}/update" method="POST" style="display:inline;">
                  <input type="hidden" name="status" value="under_review">
                  <button type="submit" class="btn" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.4);">
                    🔍 İncelemeye Al (under_review)
                  </button>
                </form>

                <form action="/applications/${app.id}/update" method="POST" style="display:inline;">
                  <input type="hidden" name="status" value="accepted">
                  <button type="submit" class="btn" style="background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4);">
                    ✅ Kabul Et (accepted)
                  </button>
                </form>

                <form action="/applications/${app.id}/update" method="POST" style="display:inline;">
                  <input type="hidden" name="status" value="rejected">
                  <button type="submit" class="btn" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4);">
                    ❌ Reddet (rejected)
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  },

  /**
   * 3. EDIT FORM - Render Edit Application Form
   */
  renderEditForm(app, { jobPostings = [], users = [] } = {}) {
    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Başvuruyu Düzenle - #${app.id}</title>
        ${getSharedStyles()}
      </head>
      <body>
        <div class="container" style="max-width: 750px;">
          ${renderNavbar('applications')}

          <a href="/applications/${app.id}" class="btn btn-back">⬅️ İptal / Başvuru Detayına Dön</a>

          <div class="card">
            <h2 style="margin-top: 0; font-size: 1.5rem;">✏️ Başvuru Durumunu Güncelle (#${app.id})</h2>
            <div style="background: var(--surface); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; border: 1px solid var(--border);">
              <div>💼 <strong>İlan:</strong> ${app.jobTitle || 'İlan #' + app.job_posting_id} (${app.jobCompany || '-'})</div>
              <div style="margin-top: 0.3rem;">👤 <strong>Aday:</strong> ${app.applicantName || 'Aday #' + app.applicant_user_id} (${app.applicantEmail || ''})</div>
            </div>

            <form action="/applications/${app.id}/update" method="POST">
              <div class="form-grid">
                <div class="form-group" style="grid-column: 1 / -1;">
                  <label for="status">Başvuru Durumu *</label>
                  <select id="status" name="status" required>
                    <option value="pending" ${app.status === 'pending' ? 'selected' : ''}>⏳ Beklemede (pending)</option>
                    <option value="under_review" ${app.status === 'under_review' ? 'selected' : ''}>🔍 İnceleniyor (under_review)</option>
                    <option value="accepted" ${app.status === 'accepted' ? 'selected' : ''}>✅ Kabul Edildi (accepted)</option>
                    <option value="rejected" ${app.status === 'rejected' ? 'selected' : ''}>❌ Reddedildi (rejected)</option>
                    <option value="withdrawn" ${app.status === 'withdrawn' ? 'selected' : ''}>⚪ Geri Çekildi (withdrawn)</option>
                  </select>
                </div>

                <div class="form-group" style="grid-column: 1 / -1;">
                  <label for="resume_url">Özgeçmiş (CV) / Portfolyo Linki</label>
                  <input type="text" id="resume_url" name="resume_url" value="${app.resume_url || ''}">
                </div>

                <div class="form-group" style="grid-column: 1 / -1;">
                  <label for="cover_letter">Ön Yazı / Niyet Mektubu</label>
                  <textarea id="cover_letter" name="cover_letter" rows="5">${app.cover_letter || ''}</textarea>
                </div>
              </div>

              <div style="margin-top: 1.5rem; display: flex; gap: 1rem; align-items: center;">
                <button type="submit" class="btn-submit" style="margin: 0;">💾 Değişiklikleri Kaydet</button>
                <a href="/applications/${app.id}" class="btn btn-view">İptal</a>
              </div>
            </form>
          </div>
        </div>
      </body>
      </html>
    `;
  }
};

module.exports = ApplicationViews;
