/**
 * Job Posting View Layer - Responsible for generating HTML representations for Job Posting Web Pages.
 * Supports:
 *   - Direct Route: GET /job-postings (Read All)
 *   - Nested Route: GET /departments/:departmentId/job-postings (Filter by Department)
 *   - Nested Route: GET /users/:userId/job-postings (Filter by Poster)
 *   - Detail Route: GET /job-postings/:id (Read One)
 *   - Edit Form: GET /job-postings/:id/edit
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
        --danger: #ef4444;
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
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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
      .dept-link {
        color: #c084fc;
        text-decoration: none;
        font-weight: 600;
        background: rgba(168, 85, 247, 0.15);
        padding: 0.25rem 0.6rem;
        border-radius: 6px;
        font-size: 0.85rem;
        display: inline-block;
        transition: all 0.2s;
      }
      .dept-link:hover { background: rgba(168, 85, 247, 0.3); text-decoration: underline; }
      .user-link { color: #38bdf8; text-decoration: none; font-weight: 500; font-size: 0.9rem; }
      .user-link:hover { text-decoration: underline; }
      .type-badge {
        padding: 0.25rem 0.65rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        display: inline-block;
      }
      .type-full-time { background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }
      .type-internship { background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); }
      .type-remote { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
      .type-part-time { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
      .app-count-badge {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.3);
        padding: 0.25rem 0.65rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        transition: all 0.2s;
      }
      .app-count-badge:hover {
        background: rgba(16, 185, 129, 0.25);
        transform: translateY(-1px);
      }
      .action-cells { display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap; }
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

function renderNavbar(activeItem = 'job-postings') {
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

const JobPostingViews = {
  /**
   * 1. READ ALL - Render Job Postings List Page
   */
  renderJobPostingListPage(jobPostings, { departments = [], currentDepartment = null, currentUser = null, users = [], isNested = false } = {}) {
    let headerTitle = '💼 İş & Staj İlanları';
    let bannerHtml = `
      <div class="route-info">
        💡 <strong>Direct Rota:</strong> <code>GET /job-postings</code> (Sistemdeki tüm kariyer ilanları listelenir).<br>
        • Bölüme göre filtreli görmek için <strong>Nested Rota:</strong> <code>GET /departments/:departmentId/job-postings</code><br>
        • Yayınlayan kullanıcıya göre görmek için <strong>Nested Rota:</strong> <code>GET /users/:userId/job-postings</code>
      </div>
    `;

    if (currentDepartment) {
      headerTitle = `💼 ${currentDepartment.name} (${currentDepartment.code}) İlanları`;
      bannerHtml = `
        <div class="route-info nested-banner">
          🔗 <strong>Nested Route Aktif:</strong> <code>GET /departments/${currentDepartment.id}/job-postings</code><br>
          Şu anda yalnızca <strong>${currentDepartment.name}</strong> (${currentDepartment.faculty}) bölümüne hedeflenmiş ilanlar listelenmektedir.
          <a href="/job-postings" style="color: #38bdf8; margin-left: 1rem; text-decoration: underline; font-weight: 600;">Tüm İlanları Gör (Direct Route)</a>
        </div>
      `;
    } else if (currentUser) {
      const authorName = `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || currentUser.email;
      headerTitle = `💼 ${authorName} Tarafından Paylaşılan İlanlar`;
      bannerHtml = `
        <div class="route-info nested-banner">
          🔗 <strong>Nested Route Aktif:</strong> <code>GET /users/${currentUser.id}/job-postings</code><br>
          Şu anda yalnızca <strong>${authorName}</strong> (${currentUser.role}) tarafından yayınlanmış ilanlar listelenmektedir.
          <a href="/job-postings" style="color: #38bdf8; margin-left: 1rem; text-decoration: underline; font-weight: 600;">Tüm İlanları Gör (Direct Route)</a>
        </div>
      `;
    }

    const totalCount = jobPostings.length;
    const fullTimeCount = jobPostings.filter(j => j.job_type === 'Full-time').length;
    const internshipCount = jobPostings.filter(j => j.job_type === 'Internship').length;
    const remoteCount = jobPostings.filter(j => j.job_type === 'Remote' || (j.location && j.location.toLowerCase().includes('remote'))).length;

    const rows = jobPostings.length > 0
      ? jobPostings.map(j => {
          let typeClass = 'type-full-time';
          if (j.job_type === 'Internship') typeClass = 'type-internship';
          if (j.job_type === 'Remote') typeClass = 'type-remote';
          if (j.job_type === 'Part-time') typeClass = 'type-part-time';

          const appCount = j.applicationsCount !== undefined ? j.applicationsCount : 0;

          return `
            <tr class="job-row" data-search="${(j.title + ' ' + j.company + ' ' + (j.department_name || '') + ' ' + j.job_type).toLowerCase()}">
              <td><span class="id-badge">#${j.id}</span></td>
              <td>
                <a href="/job-postings/${j.id}" style="color: #f8fafc; font-weight: 700; text-decoration: none; font-size: 1rem;">
                  ${j.title}
                </a>
                <div style="font-size: 0.85rem; color: #94a3b8; margin-top: 0.25rem;">
                  🏢 <strong>${j.company}</strong>
                </div>
              </td>
              <td>
                ${j.department_id
                  ? `<a href="/departments/${j.department_id}/job-postings" class="dept-link" title="Bölüm ilanlarını filtrele (Nested)">🏛️ ${j.department_code || j.department_name}</a>`
                  : '<span style="color: #64748b; font-size: 0.85rem;">Genel (Tüm Bölümler)</span>'}
              </td>
              <td><span class="type-badge ${typeClass}">${j.job_type}</span></td>
              <td>📍 ${j.location || 'Remote'}</td>
              <td>
                ${j.posted_by_user_id
                  ? `<a href="/users/${j.posted_by_user_id}/job-postings" class="user-link" title="Kullanıcının ilanlarını gör (Nested)">👤 ${j.postedBy || 'Kullanıcı #' + j.posted_by_user_id}</a>`
                  : '<span style="color: #64748b;">Anonim</span>'}
              </td>
              <td>
                <a href="/job-postings/${j.id}/applications" class="app-count-badge" title="Bu ilana yapılan başvuruları incele (Nested)">
                  📄 ${appCount} Başvuru
                </a>
              </td>
              <td class="action-cells">
                <a href="/job-postings/${j.id}" class="btn btn-view" title="İlan Detayı">👁️ Detay</a>
                <a href="/job-postings/${j.id}/edit" class="btn btn-edit" title="İlanı Düzenle">✏️ Düzenle</a>
                <form action="/job-postings/${j.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('Bu iş ilanını silmek istediğinizden emin misiniz?');">
                  <button type="submit" class="btn btn-delete" title="İlanı Sil">🗑️</button>
                </form>
              </td>
            </tr>
          `;
        }).join('')
      : `<tr><td colspan="8" style="text-align: center; color: #94a3b8; padding: 3rem;">Henüz bu kriterlere uygun iş veya staj ilanı bulunmamaktadır.</td></tr>`;

    const deptOptions = departments.map(d => `
      <option value="${d.id}" ${currentDepartment && currentDepartment.id === d.id ? 'selected' : ''}>
        ${d.code} - ${d.name}
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
          ${renderNavbar('job-postings')}

          <!-- Stats Grid -->
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-label">Toplam İlan</span>
              <span class="stat-value" style="color: #38bdf8;">${totalCount}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Tam Zamanlı</span>
              <span class="stat-value" style="color: #818cf8;">${fullTimeCount}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Staj İmkanları</span>
              <span class="stat-value" style="color: #c084fc;">${internshipCount}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Remote / Uzaktan</span>
              <span class="stat-value" style="color: #34d399;">${remoteCount}</span>
            </div>
          </div>

          <main class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
              <h1 style="margin: 0; font-size: 1.75rem;">${headerTitle}</h1>
              <a href="#new-job-form" class="btn btn-primary" style="padding: 0.6rem 1.1rem;">➕ Yeni İlan Oluştur</a>
            </div>

            ${bannerHtml}

            <!-- Live Filter / Search Bar -->
            <div class="filter-bar">
              <input type="text" id="jobSearch" class="search-input" placeholder="🔍 İlan başlığı, şirket, bölüm veya pozisyon ara..." oninput="filterJobs()">
              <span id="resultCount" style="color: var(--muted); font-size: 0.85rem;">${totalCount} ilan gösteriliyor</span>
            </div>

            <div style="overflow-x: auto;">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>İlan Başlığı & Şirket</th>
                    <th>Hedef Bölüm</th>
                    <th>Tür</th>
                    <th>Konum</th>
                    <th>Yayınlayan</th>
                    <th>Başvurular (Nested)</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody id="jobTableBody">
                  ${rows}
                </tbody>
              </table>
            </div>
          </main>

          <!-- CREATE JOB POSTING FORM -->
          <section class="card" id="new-job-form">
            <h2 style="margin-top: 0; font-size: 1.4rem;">➕ Yeni İş / Staj İlanı Yayınla</h2>
            <p style="color: var(--muted); margin-top: -0.5rem; margin-bottom: 1.5rem; font-size: 0.9rem;">
              Mezun veya işveren olarak yeni bir pozisyon açın. Öğrenciler ve diğer mezunlar bu ilana doğrudan başvurabilir.
            </p>

            <form action="/job-postings" method="POST">
              <div class="form-grid">
                <div class="form-group">
                  <label for="title">İlan / Pozisyon Başlığı *</label>
                  <input type="text" id="title" name="title" placeholder="Örn: Senior Frontend Developer" required>
                </div>

                <div class="form-group">
                  <label for="company">Şirket / Kurum Adı *</label>
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
                  <textarea id="description" name="description" rows="5" placeholder="Pozisyon gereksinimleri, teknolojiler ve aranan kriterleri buraya giriniz..." required></textarea>
                </div>
              </div>

              <button type="submit" class="btn-submit">🚀 İlanı Yayınla</button>
            </form>
          </section>
        </div>

        <script>
          function filterJobs() {
            const query = document.getElementById('jobSearch').value.toLowerCase();
            const rows = document.querySelectorAll('.job-row');
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

    const applicationRows = applications.length > 0
      ? applications.map(a => `
          <tr>
            <td><span class="id-badge">#${a.id}</span></td>
            <td>
              <a href="/users/${a.applicant_user_id}" style="color: #38bdf8; font-weight: 600; text-decoration: none;">
                👤 ${a.applicantName || 'Aday #' + a.applicant_user_id}
              </a>
              <div style="font-size: 0.8rem; color: #94a3b8;">${a.applicantEmail || ''}</div>
            </td>
            <td>
              <span class="type-badge" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;">${a.status}</span>
            </td>
            <td>
              ${a.resume_url ? `<a href="${a.resume_url}" target="_blank" style="color: #34d399; font-weight: 500;">🔗 CV Görüntüle</a>` : '<span style="color: #64748b;">Yok</span>'}
            </td>
            <td style="color: #94a3b8; font-size: 0.85rem;">
              ${new Date(a.created_at).toLocaleDateString('tr-TR')}
            </td>
            <td>
              <a href="/applications/${a.id}" class="btn btn-view">👁️ İncele</a>
            </td>
          </tr>
        `).join('')
      : `<tr><td colspan="6" style="text-align: center; color: #94a3b8; padding: 1.5rem;">Bu ilana henüz başvuru yapılmadı. İlk başvuran siz olun!</td></tr>`;

    const userOptions = users.map(u => {
      const displayName = u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email;
      return `<option value="${u.id}">#${u.id} - ${displayName} (${u.role})</option>`;
    }).join('');

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${job.title} - ${job.company} | İlan Detayı</title>
        ${getSharedStyles()}
      </head>
      <body>
        <div class="container" style="max-width: 900px;">
          ${renderNavbar('job-postings')}

          <a href="/job-postings" class="btn btn-back">⬅️ Tüm İlanlara Dön (Direct Route)</a>

          <!-- Main Job Header Card -->
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap;">
              <div>
                <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap;">
                  <span class="type-badge type-full-time">${job.job_type}</span>
                  ${job.department_id 
                    ? `<a href="/departments/${job.department_id}/job-postings" class="dept-link">🏛️ ${job.department_code || job.department_name} (Nested)</a>` 
                    : '<span style="color: #94a3b8; font-size: 0.85rem;">Genel İlan</span>'}
                  <span style="color: #94a3b8; font-size: 0.85rem;">📍 ${job.location || 'Remote'}</span>
                </div>
                <h1 style="margin: 0; font-size: 2rem;">${job.title}</h1>
                <div style="font-size: 1.2rem; color: #38bdf8; font-weight: 600; margin-top: 0.4rem;">
                  🏢 ${job.company}
                </div>
              </div>

              <div style="display: flex; gap: 0.5rem;">
                <a href="/job-postings/${job.id}/edit" class="btn btn-edit">✏️ Düzenle</a>
                <form action="/job-postings/${job.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('Bu ilanı silmek istediğinizden emin misiniz?');">
                  <button type="submit" class="btn btn-delete">🗑️ Sil</button>
                </form>
              </div>
            </div>

            <!-- Poster Meta Box -->
            <div style="margin-top: 1.5rem; padding: 1rem 1.25rem; background: var(--surface); border-radius: 10px; border: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
              <div>
                👤 <strong>Yayınlayan:</strong> 
                <a href="/users/${job.posted_by_user_id}/job-postings" class="user-link">
                  ${job.postedBy || 'Kullanıcı #' + job.posted_by_user_id}
                </a>
                ${job.poster_email ? `<span style="color: #64748b;">(${job.poster_email})</span>` : ''}
              </div>
              <div style="color: var(--muted); font-size: 0.85rem;">
                📅 Yayın Tarihi: <strong>${new Date(job.created_at).toLocaleDateString('tr-TR')}</strong>
              </div>
            </div>

            <!-- Description -->
            <h3 style="margin-top: 2rem; margin-bottom: 0.75rem; font-size: 1.2rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem;">
              📋 Pozisyon Detayları & Yetkinlikler
            </h3>
            <div style="line-height: 1.8; color: #cbd5e1; white-space: pre-wrap; font-size: 1rem;">${job.description}</div>

            <div style="margin-top: 2rem; display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
              ${job.application_link ? `
                <a href="${job.application_link}" target="_blank" class="btn btn-primary" style="padding: 0.75rem 1.5rem; font-size: 1rem;">
                  🔗 Şirket Sayfasında Başvur
                </a>
              ` : ''}
              <a href="#quick-apply" class="btn-submit" style="margin: 0; text-decoration: none;">
                📨 Sistem Üzerinden Başvur
              </a>
              <a href="/job-postings/${job.id}/applications" class="btn" style="background: rgba(168, 85, 247, 0.2); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.4); padding: 0.75rem 1.25rem;">
                🔗 Başvuruları Gör (${appCount})
              </a>
            </div>
          </div>

          <!-- Quick In-App Application Form -->
          <div class="card" id="quick-apply">
            <h2 style="margin-top: 0; font-size: 1.3rem;">📝 Bu İlana Doğrudan Başvur</h2>
            <p style="color: var(--muted); font-size: 0.9rem; margin-top: -0.25rem;">
              CV bağlantınızı ve kısa ön yazınızı bırakarak ilana başvurunuzu sisteme kaydedin.
            </p>

            <form action="/applications" method="POST">
              <input type="hidden" name="job_posting_id" value="${job.id}">

              <div class="form-grid">
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

              <button type="submit" class="btn-submit">🚀 Başvuruyu Gönder</button>
            </form>
          </div>

          <!-- Existing Applications for this Job -->
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h3 style="margin: 0; font-size: 1.2rem;">📄 Bu İlana Gelen Başvurular (${appCount})</h3>
              <a href="/job-postings/${job.id}/applications" class="btn btn-view" style="font-size: 0.8rem;">
                Tam Listeyi Aç (Nested Rota)
              </a>
            </div>

            <div style="overflow-x: auto;">
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
          </div>
        </div>
      </body>
      </html>
    `;
  },

  /**
   * 3. EDIT FORM - Render Edit Job Posting Form
   */
  renderEditForm(job, departments = [], users = []) {
    const deptOptions = departments.map(d => `
      <option value="${d.id}" ${job.department_id === d.id ? 'selected' : ''}>
        ${d.code} - ${d.name}
      </option>
    `).join('');

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>İlanı Düzenle - #${job.id}</title>
        ${getSharedStyles()}
      </head>
      <body>
        <div class="container" style="max-width: 800px;">
          ${renderNavbar('job-postings')}

          <a href="/job-postings/${job.id}" class="btn btn-back">⬅️ İptal / İlan Detayına Dön</a>

          <div class="card">
            <h2 style="margin-top: 0; font-size: 1.5rem;">✏️ İlanı Düzenle (#${job.id})</h2>
            <form action="/job-postings/${job.id}/update" method="POST">
              <div class="form-grid">
                <div class="form-group" style="grid-column: 1 / -1;">
                  <label for="title">İlan / Pozisyon Başlığı *</label>
                  <input type="text" id="title" name="title" value="${job.title}" required>
                </div>

                <div class="form-group">
                  <label for="company">Şirket / Kurum Adı *</label>
                  <input type="text" id="company" name="company" value="${job.company}" required>
                </div>

                <div class="form-group">
                  <label for="location">Konum / Şehir</label>
                  <input type="text" id="location" name="location" value="${job.location || 'Remote'}">
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
                  <input type="text" id="application_link" name="application_link" value="${job.application_link || ''}">
                </div>

                <div class="form-group" style="grid-column: 1 / -1;">
                  <label for="description">İlan Açıklaması ve Kriterler *</label>
                  <textarea id="description" name="description" rows="6" required>${job.description}</textarea>
                </div>
              </div>

              <div style="margin-top: 1.5rem; display: flex; gap: 1rem; align-items: center;">
                <button type="submit" class="btn-submit" style="margin: 0;">💾 Değişiklikleri Kaydet</button>
                <a href="/job-postings/${job.id}" class="btn btn-view">İptal</a>
              </div>
            </form>
          </div>
        </div>
      </body>
      </html>
    `;
  }
};

module.exports = JobPostingViews;
