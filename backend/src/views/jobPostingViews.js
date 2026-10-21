/**
 * Job Posting View Layer - Responsible for generating HTML representations for Job Posting Web Pages.
 * Supports:
 *   - Direct Route: GET /job-postings (Read All)
 *   - Nested Route: GET /departments/:departmentId/job-postings (Filter by Department)
 *   - Nested Route: GET /users/:userId/job-postings (Filter by Poster)
 *   - Detail Route: GET /job-postings/:id (Read One)
 *   - Edit Form: GET /job-postings/:id/edit
 */

const JobPostingViews = {
  renderJobPostingListPage(jobPostings, { departments = [], currentDepartment = null, currentUser = null, isNested = false } = {}) {
    let headerTitle = '💼 İş & Staj İlanları';
    let bannerHtml = `
      <div class="route-info">
        💡 <strong>Direct Rota:</strong> <code>GET /job-postings</code> (Tüm ilanlar listelenir).<br>
        • Bölüme göre filtreli görmek için <strong>Nested Rota</strong>: <code>GET /departments/:departmentId/job-postings</code><br>
        • Yayınlayan kullanıcıya göre görmek için <strong>Nested Rota</strong>: <code>GET /users/:userId/job-postings</code>
      </div>
    `;

    if (currentDepartment) {
      headerTitle = `💼 ${currentDepartment.name} (${currentDepartment.code}) İlanları`;
      bannerHtml = `
        <div class="route-info nested-banner">
          🔗 <strong>Nested Route Aktif:</strong> <code>GET /departments/${currentDepartment.id}/job-postings</code><br>
          Şu anda yalnızca <strong>${currentDepartment.name}</strong> (${currentDepartment.faculty}) bölümüne hedeflenmiş ilanlar listelenmektedir.
          <a href="/job-postings" style="color: #38bdf8; margin-left: 1rem; text-decoration: underline;">Tüm İlanları Gör (Direct Route)</a>
        </div>
      `;
    } else if (currentUser) {
      const authorName = `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || currentUser.email;
      headerTitle = `💼 ${authorName} Tarafından Paylaşılan İlanlar`;
      bannerHtml = `
        <div class="route-info nested-banner">
          🔗 <strong>Nested Route Aktif:</strong> <code>GET /users/${currentUser.id}/job-postings</code><br>
          Şu anda yalnızca <strong>${authorName}</strong> (${currentUser.role}) tarafından yayınlanmış ilanlar listelenmektedir.
          <a href="/job-postings" style="color: #38bdf8; margin-left: 1rem; text-decoration: underline;">Tüm İlanları Gör (Direct Route)</a>
        </div>
      `;
    }

    const rows = jobPostings.length > 0
      ? jobPostings.map(j => `
          <tr>
            <td><span class="id-badge">#${j.id}</span></td>
            <td>
              <strong>${j.title}</strong>
              <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.2rem;">🏢 ${j.company}</div>
            </td>
            <td>
              ${j.department_id
                ? `<a href="/departments/${j.department_id}/job-postings" class="dept-link" title="Bölüm ilanlarını filtrele (Nested)">🏛️ ${j.department_code || j.department_name}</a>`
                : '<span style="color: #64748b; font-size: 0.85rem;">Genel (Tüm Bölümler)</span>'}
            </td>
            <td><span class="type-badge">${j.job_type}</span></td>
            <td>📍 ${j.location || 'Remote'}</td>
            <td>
              ${j.posted_by_user_id
                ? `<a href="/users/${j.posted_by_user_id}/job-postings" class="user-link" title="Kullanıcının ilanlarını gör (Nested)">👤 ${j.postedBy || 'Kullanıcı #' + j.posted_by_user_id}</a>`
                : 'Anonim'}
            </td>
            <td class="action-cells">
              <a href="/job-postings/${j.id}" class="btn btn-view">👁️ Detay</a>
              <a href="/job-postings/${j.id}/edit" class="btn btn-edit">✏️ Düzenle</a>
              <form action="/job-postings/${j.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('Bu ilanı silmek istediğinizden emin misiniz?');">
                <button type="submit" class="btn btn-delete">🗑️ Sil</button>
              </form>
            </td>
          </tr>
        `).join('')
      : `<tr><td colspan="7" style="text-align: center; color: #94a3b8; padding: 2rem;">Henüz bu kriterlere uygun ilan bulunmamaktadır.</td></tr>`;

    const deptOptions = departments.map(d => `
      <option value="${d.id}" ${currentDepartment && currentDepartment.id === d.id ? 'selected' : ''}>
        ${d.code} - ${d.name}
      </option>
    `).join('');

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${headerTitle} - Alumni System</title>
        <style>
          :root {
            --bg: #0f172a;
            --card-bg: #1e293b;
            --accent: #38bdf8;
            --accent-hover: #0284c7;
            --purple: #a855f7;
            --text: #f8fafc;
            --muted: #94a3b8;
            --border: #334155;
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
          }
          body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: var(--bg); color: var(--text); margin: 0; padding: 2rem; }
          .container { max-width: 1150px; margin: 0 auto; }
          .nav-bar { display: flex; justify-content: space-between; align-items: center; background: var(--card-bg); padding: 1rem 1.5rem; border-radius: 12px; margin-bottom: 2rem; border: 1px solid var(--border); }
          .nav-links { display: flex; gap: 1rem; }
          .nav-links a { color: var(--text); text-decoration: none; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 500; font-size: 0.95rem; }
          .nav-links a:hover, .nav-links a.active { background: #334155; color: var(--accent); }
          .card { background-color: var(--card-bg); border-radius: 12px; padding: 1.5rem; border: 1px solid var(--border); margin-bottom: 2rem; }
          .route-info { background: rgba(56, 189, 248, 0.1); border-left: 4px solid var(--accent); padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem; font-size: 0.95rem; line-height: 1.5; }
          .nested-banner { background: rgba(168, 85, 247, 0.15); border-left: 4px solid var(--purple); }
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
          th, td { text-align: left; padding: 0.85rem 1rem; border-bottom: 1px solid var(--border); font-size: 0.9rem; }
          th { background-color: #172033; color: var(--muted); font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; }
          tr:hover td { background-color: rgba(255, 255, 255, 0.02); }
          .id-badge { background: #334155; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; color: #94a3b8; }
          .dept-link { color: #c084fc; text-decoration: none; font-weight: 600; background: rgba(168, 85, 247, 0.15); padding: 0.2rem 0.5rem; border-radius: 4px; }
          .dept-link:hover { text-decoration: underline; background: rgba(168, 85, 247, 0.25); }
          .user-link { color: #38bdf8; text-decoration: none; font-weight: 500; }
          .user-link:hover { text-decoration: underline; }
          .type-badge { background: rgba(56, 189, 248, 0.15); color: #38bdf8; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600; }
          .action-cells { display: flex; gap: 0.4rem; }
          .btn { display: inline-block; padding: 0.35rem 0.65rem; border-radius: 6px; text-decoration: none; font-size: 0.8rem; font-weight: 500; cursor: pointer; border: none; }
          .btn-view { background: #334155; color: #e2e8f0; }
          .btn-edit { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
          .btn-delete { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
          .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-top: 1rem; }
          .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
          .form-group label { font-size: 0.85rem; color: var(--muted); font-weight: 500; }
          .form-group input, .form-group select, .form-group textarea { background: #0f172a; border: 1px solid var(--border); border-radius: 6px; padding: 0.6rem; color: var(--text); font-size: 0.9rem; }
          .form-group textarea { resize: vertical; min-height: 80px; }
          .btn-submit { background: var(--accent); color: #0f172a; font-weight: 600; padding: 0.65rem 1.25rem; border-radius: 6px; cursor: pointer; border: none; align-self: flex-start; margin-top: 1rem; }
          .btn-submit:hover { background: var(--accent-hover); }
        </style>
      </head>
      <body>
        <div class="container">
          <header class="nav-bar">
            <div style="font-weight: 700; font-size: 1.2rem; color: var(--accent);">🎓 Alumni Tracking System</div>
            <nav class="nav-links">
              <a href="/home">🏠 Ana Sayfa</a>
              <a href="/users">👥 Kullanıcılar</a>
              <a href="/departments">🏛️ Bölümler (Direct)</a>
              <a href="/job-postings" class="${!isNested ? 'active' : ''}">💼 İlanlar (Direct)</a>
              <a href="/announcements">📢 Duyurular</a>
              <a href="/api/swagger" target="_blank" style="color: #38bdf8; font-weight: bold;">⚡ Swagger API</a>
            </nav>
          </header>

          <main class="card">
            <h1>${headerTitle}</h1>
            ${bannerHtml}

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>İlan Başlığı & Şirket</th>
                  <th>Hedef Bölüm</th>
                  <th>Tür</th>
                  <th>Konum</th>
                  <th>Yayınlayan</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </main>

          <section class="card">
            <h3>➕ Yeni İş / Staj İlanı Yayınla (Direct & Nested Action)</h3>
            <form action="/job-postings" method="POST">
              <div class="form-grid">
                <div class="form-group">
                  <label for="title">İlan Başlığı *</label>
                  <input type="text" id="title" name="title" placeholder="Örn: Frontend Developer" required>
                </div>
                <div class="form-group">
                  <label for="company">Şirket / Kurum *</label>
                  <input type="text" id="company" name="company" placeholder="Örn: Trendyol" required>
                </div>
                <div class="form-group">
                  <label for="location">Konum</label>
                  <input type="text" id="location" name="location" placeholder="İstanbul / Remote" value="Remote">
                </div>
                <div class="form-group">
                  <label for="job_type">Çalışma Şekli</label>
                  <select id="job_type" name="job_type">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship (Staj)</option>
                    <option value="Remote">Remote</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="department_id">Hedef Bölüm (İlişkili Bölüm)</label>
                  <select id="department_id" name="department_id">
                    <option value="">Genel (Tüm Bölümler)</option>
                    ${deptOptions}
                  </select>
                </div>
                <div class="form-group">
                  <label for="posted_by_user_id">Yayınlayan Kullanıcı ID *</label>
                  <input type="number" id="posted_by_user_id" name="posted_by_user_id" value="${currentUser ? currentUser.id : '1'}" required>
                </div>
                <div class="form-group" style="grid-column: 1 / -1;">
                  <label for="application_link">Başvuru Linki / E-Posta</label>
                  <input type="text" id="application_link" name="application_link" placeholder="https://company.com/apply">
                </div>
                <div class="form-group" style="grid-column: 1 / -1;">
                  <label for="description">İlan Açıklaması ve Aranan Kriterler *</label>
                  <textarea id="description" name="description" placeholder="Adaylarda aranan yetkinlikler ve pozisyon detayları..." required></textarea>
                </div>
              </div>
              <button type="submit" class="btn-submit">🚀 İlanı Yayınla</button>
            </form>
          </section>
        </div>
      </body>
      </html>
    `;
  },

  renderJobPostingDetailPage(job) {
    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${job.title} - İlan Detayı</title>
        <style>
          :root { --bg: #0f172a; --card-bg: #1e293b; --accent: #38bdf8; --text: #f8fafc; --muted: #94a3b8; --border: #334155; }
          body { font-family: 'Inter', system-ui, sans-serif; background-color: var(--bg); color: var(--text); padding: 2rem; margin: 0; }
          .container { max-width: 800px; margin: 0 auto; }
          .card { background-color: var(--card-bg); border-radius: 12px; padding: 2rem; border: 1px solid var(--border); margin-bottom: 1.5rem; }
          .btn { display: inline-block; padding: 0.5rem 1rem; border-radius: 6px; text-decoration: none; font-size: 0.9rem; font-weight: 500; cursor: pointer; border: none; }
          .btn-back { background: #334155; color: #e2e8f0; margin-bottom: 1rem; }
          .btn-apply { background: var(--accent); color: #0f172a; font-weight: 600; font-size: 1rem; padding: 0.75rem 1.5rem; }
          .badge { padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <a href="/job-postings" class="btn btn-back">⬅️ Tüm İlanlara Dön (Direct)</a>
          <div class="card">
            <span class="badge" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8;">${job.job_type}</span>
            ${job.department_id 
              ? `<a href="/departments/${job.department_id}/job-postings" class="badge" style="background: rgba(168, 85, 247, 0.2); color: #c084fc; text-decoration: none; margin-left: 0.5rem;">🏛️ ${job.department_code || job.department_name} (Nested Rota)</a>` 
              : ''}
            
            <h1 style="margin-top: 1rem; margin-bottom: 0.3rem;">${job.title}</h1>
            <div style="color: var(--muted); font-size: 1.05rem;">🏢 ${job.company} • 📍 ${job.location || 'Remote'}</div>

            <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(15, 23, 42, 0.6); border-radius: 8px; border: 1px solid var(--border);">
              <div style="font-size: 0.9rem; color: var(--muted);">
                👤 <strong>Yayınlayan:</strong> ${job.postedBy || 'Kullanıcı #' + job.posted_by_user_id} 
                ${job.poster_email ? `(${job.poster_email})` : ''} • 
                <a href="/users/${job.posted_by_user_id}/job-postings" style="color: #38bdf8;">Yayıncının Diğer İlanları (Nested)</a><br>
                📅 <strong>Yayın Tarihi:</strong> ${new Date(job.created_at).toLocaleDateString('tr-TR')}
              </div>
            </div>

            <h3 style="margin-top: 2rem;">İlan Açıklaması & Kriterler</h3>
            <div style="line-height: 1.7; color: #cbd5e1; white-space: pre-wrap;">${job.description}</div>

            <div style="margin-top: 2rem; display: flex; gap: 1rem; align-items: center;">
              ${job.application_link ? `<a href="${job.application_link}" target="_blank" class="btn btn-apply">🔗 Hemen Başvur</a>` : ''}
              <a href="/job-postings/${job.id}/edit" class="btn" style="background: #334155; color: #f8fafc;">✏️ Düzenle</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  },

  renderEditForm(job, departments = []) {
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
        <title>İlan Düzenle - #${job.id}</title>
        <style>
          :root { --bg: #0f172a; --card-bg: #1e293b; --accent: #38bdf8; --text: #f8fafc; --muted: #94a3b8; --border: #334155; }
          body { font-family: 'Inter', system-ui, sans-serif; background-color: var(--bg); color: var(--text); padding: 2rem; margin: 0; }
          .container { max-width: 700px; margin: 0 auto; }
          .card { background-color: var(--card-bg); border-radius: 12px; padding: 2rem; border: 1px solid var(--border); }
          .form-group { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem; }
          .form-group label { font-size: 0.85rem; color: var(--muted); font-weight: 500; }
          .form-group input, .form-group select, .form-group textarea { background: #0f172a; border: 1px solid var(--border); border-radius: 6px; padding: 0.65rem; color: var(--text); font-size: 0.95rem; }
          .btn-submit { background: var(--accent); color: #0f172a; font-weight: 600; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; border: none; }
          .btn-back { background: #334155; color: #e2e8f0; text-decoration: none; display: inline-block; padding: 0.5rem 1rem; border-radius: 6px; margin-bottom: 1rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <a href="/job-postings/${job.id}" class="btn-back">⬅️ İptal / Geri Dön</a>
          <div class="card">
            <h2>✏️ İlanı Düzenle (#${job.id})</h2>
            <form action="/job-postings/${job.id}/update" method="POST">
              <div class="form-group">
                <label for="title">İlan Başlığı</label>
                <input type="text" id="title" name="title" value="${job.title}" required>
              </div>
              <div class="form-group">
                <label for="company">Şirket / Kurum</label>
                <input type="text" id="company" name="company" value="${job.company}" required>
              </div>
              <div class="form-group">
                <label for="location">Konum</label>
                <input type="text" id="location" name="location" value="${job.location || 'Remote'}">
              </div>
              <div class="form-group">
                <label for="job_type">Çalışma Şekli</label>
                <select id="job_type" name="job_type">
                  <option value="Full-time" ${job.job_type === 'Full-time' ? 'selected' : ''}>Full-time</option>
                  <option value="Part-time" ${job.job_type === 'Part-time' ? 'selected' : ''}>Part-time</option>
                  <option value="Internship" ${job.job_type === 'Internship' ? 'selected' : ''}>Internship (Staj)</option>
                  <option value="Remote" ${job.job_type === 'Remote' ? 'selected' : ''}>Remote</option>
                  <option value="Contract" ${job.job_type === 'Contract' ? 'selected' : ''}>Contract</option>
                </select>
              </div>
              <div class="form-group">
                <label for="department_id">Hedef Bölüm (İlişkili Bölüm)</label>
                <select id="department_id" name="department_id">
                  <option value="">Genel (Tüm Bölümler)</option>
                  ${deptOptions}
                </select>
              </div>
              <div class="form-group">
                <label for="application_link">Başvuru Linki</label>
                <input type="text" id="application_link" name="application_link" value="${job.application_link || ''}">
              </div>
              <div class="form-group">
                <label for="description">Açıklama</label>
                <textarea id="description" name="description" rows="5" required>${job.description}</textarea>
              </div>
              <button type="submit" class="btn-submit">💾 Değişiklikleri Kaydet</button>
            </form>
          </div>
        </div>
      </body>
      </html>
    `;
  }
};

module.exports = JobPostingViews;
