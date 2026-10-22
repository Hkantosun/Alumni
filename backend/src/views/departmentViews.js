/**
 * Department View Layer - Responsible for generating HTML representations for Department Web Pages.
 * Supports direct (/departments) and nested links (/departments/:id/job-postings).
 */

const DepartmentViews = {
  renderDepartmentListPage(departments) {
    const rows = departments.length > 0
      ? departments.map(d => `
          <tr>
            <td><span class="id-badge">#${d.id}</span></td>
            <td><strong><span class="dept-code">${d.code}</span></strong></td>
            <td><strong>${d.name}</strong></td>
            <td>${d.faculty}</td>
            <td>
              <span class="badge ${d.jobPostingsCount > 0 ? 'badge-primary' : 'badge-secondary'}">
                💼 ${d.jobPostingsCount || 0} İlan
              </span>
            </td>
            <td class="action-cells">
              <a href="/departments/${d.id}" class="btn btn-view">👁️ Bölüm Detay</a>
              <a href="/departments/${d.id}/job-postings" class="btn btn-nested">🔗 İlanlar (Nested)</a>
              <a href="/api/departments/${d.id}/job-postings" target="_blank" class="btn btn-api">⚡ JSON API</a>
            </td>
          </tr>
        `).join('')
      : `<tr><td colspan="6" style="text-align: center; color: #94a3b8; padding: 2rem;">Kayıtlı bölüm bulunamadı.</td></tr>`;

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🏛️ Bölüm Yönetimi & Nested Rotalar - Alumni System</title>
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
            --danger: #ef4444;
          }
          body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: var(--bg); color: var(--text); margin: 0; padding: 2rem; }
          .container { max-width: 1100px; margin: 0 auto; }
          .nav-bar { display: flex; justify-content: space-between; align-items: center; background: var(--card-bg); padding: 1rem 1.5rem; border-radius: 12px; margin-bottom: 2rem; border: 1px solid var(--border); }
          .nav-links { display: flex; gap: 1rem; }
          .nav-links a { color: var(--text); text-decoration: none; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 500; font-size: 0.95rem; transition: background 0.2s; }
          .nav-links a:hover, .nav-links a.active { background: #334155; color: var(--accent); }
          .card { background-color: var(--card-bg); border-radius: 12px; padding: 1.5rem; border: 1px solid var(--border); margin-bottom: 2rem; }
          h1 { margin-top: 0; font-size: 1.8rem; color: var(--text); }
          .route-info { background: rgba(56, 189, 248, 0.1); border-left: 4px solid var(--accent); padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem; font-size: 0.95rem; line-height: 1.5; }
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
          th, td { text-align: left; padding: 0.85rem 1rem; border-bottom: 1px solid var(--border); font-size: 0.95rem; }
          th { background-color: #172033; color: var(--muted); font-weight: 600; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.05em; }
          tr:hover td { background-color: rgba(255, 255, 255, 0.02); }
          .id-badge { background: #334155; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; color: #94a3b8; }
          .dept-code { background: rgba(168, 85, 247, 0.15); color: #c084fc; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: bold; }
          .badge { padding: 0.25rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
          .badge-primary { background: rgba(56, 189, 248, 0.2); color: #38bdf8; }
          .badge-secondary { background: rgba(148, 163, 184, 0.15); color: #94a3b8; }
          .action-cells { display: flex; gap: 0.4rem; flex-wrap: wrap; }
          .btn { display: inline-block; padding: 0.4rem 0.75rem; border-radius: 6px; text-decoration: none; font-size: 0.85rem; font-weight: 500; cursor: pointer; border: none; }
          .btn-view { background: #334155; color: #e2e8f0; }
          .btn-nested { background: rgba(168, 85, 247, 0.2); color: #d8b4fe; border: 1px solid rgba(168, 85, 247, 0.4); }
          .btn-nested:hover { background: rgba(168, 85, 247, 0.35); }
          .btn-api { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
        </style>
      </head>
      <body>
        <div class="container">
          <header class="nav-bar">
            <div style="font-weight: 700; font-size: 1.2rem; color: var(--accent);">🎓 Alumni Tracking System</div>
            <nav class="nav-links">
              <a href="/home">🏠 Ana Sayfa</a>
              <a href="/users">👥 Kullanıcılar</a>
              <a href="/departments" class="active">🏛️ Bölümler (Direct)</a>
              <a href="/job-postings">💼 İlanlar</a>
              <a href="/applications">📄 Başvurular</a>
              <a href="/announcements">📢 Duyurular</a>
              <a href="/api/swagger" target="_blank" style="color: #38bdf8; font-weight: bold;">⚡ Swagger API</a>
            </nav>
          </header>

          <main class="card">
            <h1>🏛️ Bölüm Listesi (Direct Route: <code>GET /departments</code>)</h1>
            <div class="route-info">
              💡 <strong>Direct ve Nested Rota Mimarisi:</strong><br>
              • <strong>Direct Rota:</strong> <code>GET /departments</code> (tüm bölümlerin listesi)<br>
              • <strong>Nested Rotalar:</strong> Bölümler ile İş/Staj İlanları arasındaki ilişkiyi temsil eden 
                <code>GET /departments/:departmentId/job-postings</code> (Web HTML) ve 
                <code>GET /api/departments/:departmentId/job-postings</code> (REST API).
            </div>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Kod</th>
                  <th>Bölüm Adı</th>
                  <th>Fakülte</th>
                  <th>İlan Sayısı</th>
                  <th>İşlemler (Direct & Nested)</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </main>
        </div>
      </body>
      </html>
    `;
  },

  renderDepartmentDetailPage(department, jobPostings = []) {
    const jobCards = jobPostings.length > 0
      ? jobPostings.map(j => `
          <div style="background: rgba(15, 23, 42, 0.6); padding: 1rem; border-radius: 8px; margin-bottom: 0.75rem; border: 1px solid #334155; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 600; font-size: 1rem; color: #f8fafc;">${j.title}</div>
              <div style="color: #94a3b8; font-size: 0.85rem; margin-top: 0.2rem;">🏢 ${j.company} • 📍 ${j.location} • 💼 ${j.job_type}</div>
            </div>
            <div>
              <a href="/job-postings/${j.id}" class="btn btn-view">👁️ İlan Detayı</a>
            </div>
          </div>
        `).join('')
      : `<p style="color: #94a3b8; font-size: 0.9rem;">Bu bölüme henüz atanmış açık bir iş/staj ilanı bulunmamaktadır.</p>`;

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${department.name} - Bölüm Detayı</title>
        <style>
          :root { --bg: #0f172a; --card-bg: #1e293b; --accent: #38bdf8; --text: #f8fafc; --muted: #94a3b8; --border: #334155; }
          body { font-family: 'Inter', system-ui, sans-serif; background-color: var(--bg); color: var(--text); padding: 2rem; margin: 0; }
          .container { max-width: 800px; margin: 0 auto; }
          .card { background-color: var(--card-bg); border-radius: 12px; padding: 2rem; border: 1px solid var(--border); margin-bottom: 1.5rem; }
          .btn { display: inline-block; padding: 0.5rem 1rem; border-radius: 6px; text-decoration: none; font-size: 0.9rem; font-weight: 500; cursor: pointer; border: none; }
          .btn-back { background: #334155; color: #e2e8f0; margin-bottom: 1rem; }
          .btn-nested { background: rgba(168, 85, 247, 0.2); color: #d8b4fe; border: 1px solid rgba(168, 85, 247, 0.4); }
          .btn-view { background: #334155; color: #38bdf8; }
          .code-badge { background: rgba(168, 85, 247, 0.2); color: #c084fc; padding: 0.2rem 0.6rem; border-radius: 6px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <a href="/departments" class="btn btn-back">⬅️ Bölüm Listesine Dön</a>
          <div class="card">
            <span class="code-badge">${department.code}</span>
            <h1 style="margin-top: 0.8rem; margin-bottom: 0.3rem;">${department.name}</h1>
            <p style="color: var(--muted); margin-top: 0;">🏛️ Fakülte: <strong>${department.faculty}</strong></p>
            <p style="line-height: 1.6; color: #cbd5e1;">${department.description || 'Bölüm açıklaması girilmemiş.'}</p>
            
            <div style="margin-top: 1.5rem; display: flex; gap: 0.5rem;">
              <a href="/departments/${department.id}/job-postings" class="btn btn-nested">🔗 Bu Bölümün İlanları (Nested Sayfa)</a>
              <a href="/api/departments/${department.id}/job-postings" target="_blank" class="btn" style="background: rgba(16,185,129,0.15); color: #34d399;">⚡ JSON API Rota</a>
            </div>
          </div>

          <div class="card">
            <h3>💼 Bu Bölüme Özel Açılan İlanlar (${jobPostings.length})</h3>
            ${jobCards}
          </div>
        </div>
      </body>
      </html>
    `;
  }
};

module.exports = DepartmentViews;
