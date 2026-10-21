/**
 * Application View Layer - Responsible for generating HTML representations for Application Web Pages.
 * Supports:
 *   - Direct Route: GET /applications
 *   - Nested Route: GET /job-postings/:jobPostingId/applications
 *   - Nested Route: GET /users/:userId/applications
 *   - Detail Route: GET /applications/:id
 *   - Edit Form: GET /applications/:id/edit
 */

const ApplicationViews = {
  renderApplicationListPage(applications, { currentJob = null, currentUser = null, isNested = false } = {}) {
    let headerTitle = '📄 İş & Staj Başvuruları';
    let bannerHtml = `
      <div class="route-info">
        💡 <strong>Direct Rota:</strong> <code>GET /applications</code> (Sistemdeki tüm başvurular listelenir).<br>
        • İlana göre başvuruları görmek için <strong>Nested Rota:</strong> <code>GET /job-postings/:jobPostingId/applications</code><br>
        • Adaya göre başvuruları görmek için <strong>Nested Rota:</strong> <code>GET /users/:userId/applications</code>
      </div>
    `;

    if (currentJob) {
      headerTitle = `📄 "${currentJob.title}" İlanına Yapılan Başvurular`;
      bannerHtml = `
        <div class="route-info nested-banner">
          🔗 <strong>Nested Route Aktif:</strong> <code>GET /job-postings/${currentJob.id}/applications</code><br>
          Şu anda yalnızca <strong>${currentJob.company}</strong> bünyesindeki <strong>${currentJob.title}</strong> ilanına ait başvurular listelenmektedir.
          <a href="/applications" style="color: #38bdf8; margin-left: 1rem; text-decoration: underline;">Tüm Başvuruları Gör (Direct Route)</a>
        </div>
      `;
    } else if (currentUser) {
      const applicantName = `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || currentUser.email;
      headerTitle = `📄 ${applicantName} Tarafından Yapılan Başvurular`;
      bannerHtml = `
        <div class="route-info nested-banner">
          🔗 <strong>Nested Route Aktif:</strong> <code>GET /users/${currentUser.id}/applications</code><br>
          Şu anda yalnızca <strong>${applicantName}</strong> (${currentUser.role}) adayının yaptığı başvurular listelenmektedir.
          <a href="/applications" style="color: #38bdf8; margin-left: 1rem; text-decoration: underline;">Tüm Başvuruları Gör (Direct Route)</a>
        </div>
      `;
    }

    const rows = applications.length > 0
      ? applications.map(a => {
          let statusBadgeClass = 'status-pending';
          if (a.status === 'accepted') statusBadgeClass = 'status-accepted';
          if (a.status === 'rejected') statusBadgeClass = 'status-rejected';
          if (a.status === 'under_review') statusBadgeClass = 'status-review';

          return `
            <tr>
              <td><span class="id-badge">#${a.id}</span></td>
              <td>
                <a href="/job-postings/${a.job_posting_id}" style="color: #f8fafc; font-weight: 600; text-decoration: none;">
                  ${a.jobTitle || 'İlan #' + a.job_posting_id}
                </a>
                <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.2rem;">🏢 ${a.jobCompany || '-'}</div>
              </td>
              <td>
                <a href="/users/${a.applicant_user_id}" style="color: #38bdf8; text-decoration: none; font-weight: 500;">
                  👤 ${a.applicantName || 'Kullanıcı #' + a.applicant_user_id}
                </a>
                <div style="font-size: 0.75rem; color: #64748b;">${a.applicantEmail || ''}</div>
              </td>
              <td>
                <span class="status-badge ${statusBadgeClass}">${a.status}</span>
              </td>
              <td>
                ${a.resume_url ? `<a href="${a.resume_url}" target="_blank" style="color: #34d399; font-size: 0.85rem;">🔗 CV Görüntüle</a>` : '<span style="color:#64748b;">-</span>'}
              </td>
              <td style="color: #94a3b8; font-size: 0.85rem;">
                ${new Date(a.created_at).toLocaleDateString('tr-TR')}
              </td>
              <td class="action-cells">
                <a href="/applications/${a.id}" class="btn btn-view">👁️ Detay</a>
                <a href="/applications/${a.id}/edit" class="btn btn-edit">✏️ Durum</a>
                <form action="/applications/${a.id}/delete" method="POST" style="display:inline;" onsubmit="return confirm('Başvuruyu silmek istediğinize emin misiniz?');">
                  <button type="submit" class="btn btn-delete">🗑️ Sil</button>
                </form>
              </td>
            </tr>
          `;
        }).join('')
      : `<tr><td colspan="7" style="text-align: center; color: #94a3b8; padding: 2rem;">Henüz kayıtlı başvuru bulunmamaktadır.</td></tr>`;

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${headerTitle} - Alumni System</title>
        <style>
          :root {
            --bg: #0f172a; --card-bg: #1e293b; --accent: #38bdf8; --purple: #a855f7;
            --text: #f8fafc; --muted: #94a3b8; --border: #334155; --success: #10b981;
          }
          body { font-family: 'Inter', system-ui, sans-serif; background-color: var(--bg); color: var(--text); margin: 0; padding: 2rem; }
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
          th { background-color: #172033; color: var(--muted); font-weight: 600; text-transform: uppercase; font-size: 0.75rem; }
          tr:hover td { background-color: rgba(255, 255, 255, 0.02); }
          .id-badge { background: #334155; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; color: #94a3b8; }
          .status-badge { padding: 0.25rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; text-transform: capitalize; }
          .status-pending { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
          .status-accepted { background: rgba(16, 185, 129, 0.2); color: #34d399; }
          .status-rejected { background: rgba(239, 68, 68, 0.2); color: #f87171; }
          .status-review { background: rgba(56, 189, 248, 0.2); color: #38bdf8; }
          .action-cells { display: flex; gap: 0.4rem; }
          .btn { display: inline-block; padding: 0.35rem 0.65rem; border-radius: 6px; text-decoration: none; font-size: 0.8rem; font-weight: 500; cursor: pointer; border: none; }
          .btn-view { background: #334155; color: #e2e8f0; }
          .btn-edit { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
          .btn-delete { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
          .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-top: 1rem; }
          .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
          .form-group label { font-size: 0.85rem; color: var(--muted); }
          .form-group input, .form-group select, .form-group textarea { background: #0f172a; border: 1px solid var(--border); border-radius: 6px; padding: 0.6rem; color: var(--text); }
          .btn-submit { background: var(--accent); color: #0f172a; font-weight: 600; padding: 0.65rem 1.25rem; border-radius: 6px; cursor: pointer; border: none; margin-top: 1rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <header class="nav-bar">
            <div style="font-weight: 700; font-size: 1.2rem; color: var(--accent);">🎓 Alumni Tracking System</div>
            <nav class="nav-links">
              <a href="/home">🏠 Ana Sayfa</a>
              <a href="/users">👥 Kullanıcılar</a>
              <a href="/departments">🏛️ Bölümler</a>
              <a href="/job-postings">💼 İlanlar</a>
              <a href="/applications" class="${!isNested ? 'active' : ''}">📄 Başvurular (Direct)</a>
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
                  <th>İlan Bilgisi</th>
                  <th>Aday</th>
                  <th>Durum</th>
                  <th>Özgeçmiş</th>
                  <th>Tarih</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </main>

          <section class="card">
            <h3>➕ Yeni Başvuru Gönder (Direct & Nested Web Action)</h3>
            <form action="/applications" method="POST">
              <div class="form-grid">
                <div class="form-group">
                  <label for="job_posting_id">İlan ID *</label>
                  <input type="number" id="job_posting_id" name="job_posting_id" value="${currentJob ? currentJob.id : '1'}" required>
                </div>
                <div class="form-group">
                  <label for="applicant_user_id">Aday Kullanıcı ID *</label>
                  <input type="number" id="applicant_user_id" name="applicant_user_id" value="${currentUser ? currentUser.id : '12'}" required>
                </div>
                <div class="form-group">
                  <label for="resume_url">CV / Portfolyo Linki</label>
                  <input type="text" id="resume_url" name="resume_url" placeholder="https://linkedin.com/in/... veya CV linki">
                </div>
                <div class="form-group" style="grid-column: 1 / -1;">
                  <label for="cover_letter">Ön Yazı / Niyet Mektubu</label>
                  <textarea id="cover_letter" name="cover_letter" rows="3" placeholder="Pozisyona neden başvurduğunuzu ve niteliklerinizi açıklayın..."></textarea>
                </div>
              </div>
              <button type="submit" class="btn-submit">📨 Başvuruyu Gönder</button>
            </form>
          </section>
        </div>
      </body>
      </html>
    `;
  },

  renderApplicationDetailPage(app) {
    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Başvuru Detayı #${app.id}</title>
        <style>
          :root { --bg: #0f172a; --card-bg: #1e293b; --accent: #38bdf8; --text: #f8fafc; --muted: #94a3b8; --border: #334155; }
          body { font-family: 'Inter', system-ui, sans-serif; background-color: var(--bg); color: var(--text); padding: 2rem; margin: 0; }
          .container { max-width: 800px; margin: 0 auto; }
          .card { background-color: var(--card-bg); border-radius: 12px; padding: 2rem; border: 1px solid var(--border); margin-bottom: 1.5rem; }
          .btn { display: inline-block; padding: 0.5rem 1rem; border-radius: 6px; text-decoration: none; font-size: 0.9rem; font-weight: 500; }
          .btn-back { background: #334155; color: #e2e8f0; margin-bottom: 1rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <a href="/applications" class="btn btn-back">⬅️ Başvuru Listesine Dön</a>
          <div class="card">
            <h1>📄 Başvuru Detayı (#${app.id})</h1>
            <p><strong>İlan:</strong> <a href="/job-postings/${app.job_posting_id}" style="color: #38bdf8;">${app.jobTitle || 'İlan #' + app.job_posting_id}</a> (${app.jobCompany || '-'})</p>
            <p><strong>Aday:</strong> ${app.applicantName || 'Aday #' + app.applicant_user_id} (${app.applicantEmail || ''})</p>
            <p><strong>Başvuru Durumu:</strong> <span style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: bold;">${app.status}</span></p>
            <p><strong>Başvuru Tarihi:</strong> ${new Date(app.created_at).toLocaleString('tr-TR')}</p>
            ${app.resume_url ? `<p><strong>CV Bağlantısı:</strong> <a href="${app.resume_url}" target="_blank" style="color: #34d399;">${app.resume_url}</a></p>` : ''}
            
            <h3 style="margin-top: 1.5rem;">Ön Yazı (Cover Letter)</h3>
            <div style="background: rgba(15,23,42,0.6); padding: 1rem; border-radius: 8px; border: 1px solid var(--border); color: #cbd5e1; line-height: 1.6;">
              ${app.cover_letter || 'Ön yazı eklenmemiş.'}
            </div>

            <div style="margin-top: 1.5rem; display: flex; gap: 0.5rem;">
              <a href="/applications/${app.id}/edit" class="btn" style="background: #334155; color: #fbbf24;">✏️ Durumu Güncelle</a>
              <a href="/job-postings/${app.job_posting_id}/applications" class="btn" style="background: rgba(168,85,247,0.2); color: #d8b4fe;">🔗 Bu İlanın Tüm Başvuruları (Nested)</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  },

  renderEditForm(app) {
    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Başvuru Güncelle - #${app.id}</title>
        <style>
          :root { --bg: #0f172a; --card-bg: #1e293b; --accent: #38bdf8; --text: #f8fafc; --muted: #94a3b8; --border: #334155; }
          body { font-family: 'Inter', system-ui, sans-serif; background-color: var(--bg); color: var(--text); padding: 2rem; margin: 0; }
          .container { max-width: 600px; margin: 0 auto; }
          .card { background-color: var(--card-bg); border-radius: 12px; padding: 2rem; border: 1px solid var(--border); }
          .form-group { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem; }
          .form-group label { font-size: 0.85rem; color: var(--muted); }
          .form-group select, .form-group input, .form-group textarea { background: #0f172a; border: 1px solid var(--border); border-radius: 6px; padding: 0.65rem; color: var(--text); font-size: 0.95rem; }
          .btn-submit { background: var(--accent); color: #0f172a; font-weight: 600; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; border: none; }
          .btn-back { background: #334155; color: #e2e8f0; text-decoration: none; display: inline-block; padding: 0.5rem 1rem; border-radius: 6px; margin-bottom: 1rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <a href="/applications/${app.id}" class="btn-back">⬅️ İptal / Geri Dön</a>
          <div class="card">
            <h2>✏️ Başvuru Durumunu Güncelle (#${app.id})</h2>
            <form action="/applications/${app.id}/update" method="POST">
              <div class="form-group">
                <label for="status">Başvuru Durumu</label>
                <select id="status" name="status">
                  <option value="pending" ${app.status === 'pending' ? 'selected' : ''}>Beklemede (pending)</option>
                  <option value="under_review" ${app.status === 'under_review' ? 'selected' : ''}>İnceleniyor (under_review)</option>
                  <option value="accepted" ${app.status === 'accepted' ? 'selected' : ''}>Kabul Edildi (accepted)</option>
                  <option value="rejected" ${app.status === 'rejected' ? 'selected' : ''}>Reddedildi (rejected)</option>
                  <option value="withdrawn" ${app.status === 'withdrawn' ? 'selected' : ''}>Geri Çekildi (withdrawn)</option>
                </select>
              </div>
              <div class="form-group">
                <label for="resume_url">Özgeçmiş Linki</label>
                <input type="text" id="resume_url" name="resume_url" value="${app.resume_url || ''}">
              </div>
              <div class="form-group">
                <label for="cover_letter">Ön Yazı</label>
                <textarea id="cover_letter" name="cover_letter" rows="4">${app.cover_letter || ''}</textarea>
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

module.exports = ApplicationViews;
