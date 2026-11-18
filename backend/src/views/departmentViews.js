/**
 * Department View Layer - Responsible for generating HTML representations for Department Web Pages.
 * Styled consistently with DESIGN.md (Mintlify Design System) via MintlifyTheme.
 * Supports direct (/departments) and nested links (/departments/:id/job-postings).
 */

const MintlifyTheme = require('./mintlifyTheme');
const { escapeHtml } = MintlifyTheme;

const DepartmentViews = {
  renderDepartmentListPage(departments) {
    const totalJobsAcrossDepts = departments.reduce((sum, d) => sum + (Number(d.jobPostingsCount) || 0), 0);

    const rows = departments.length > 0
      ? departments.map(d => `
          <tr>
            <td><span class="code-inline">#${d.id}</span></td>
            <td><span class="badge-tag">${escapeHtml(d.code)}</span></td>
            <td><strong style="color: var(--ink); font-weight: 600;">${escapeHtml(d.name)}</strong></td>
            <td style="color: var(--steel);">${escapeHtml(d.faculty)}</td>
            <td>
              <span class="${d.jobPostingsCount > 0 ? 'badge-green' : 'badge-type'}">
                ${d.jobPostingsCount || 0} İlan
              </span>
            </td>
            <td class="action-cells">
              <a href="/departments/${d.id}" class="btn btn-secondary btn-sm">Detay</a>
              <a href="/departments/${d.id}/job-postings" class="btn btn-nested btn-sm">İlanlar (Nested)</a>
              <a href="/api/departments/${d.id}/job-postings" target="_blank" class="btn btn-ghost btn-sm">JSON API ↗</a>
            </td>
          </tr>
        `).join('')
      : `<tr><td colspan="6" style="text-align: center; color: var(--steel); padding: 32px;">Kayıtlı bölüm bulunamadı.</td></tr>`;

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bölümler & Nested Rotalar — İÜ YBS</title>
        <style>
          ${MintlifyTheme.getBaseStyles()}
        </style>
      </head>
      <body>
        ${MintlifyTheme.renderHeader('departments')}

        <main class="page-main">
          <div class="page-container">
            <div class="page-header-block">
              <div>
                <span class="section-kicker"><span class="mint-dot"></span> AKADEMİK BİRİMLER</span>
                <h1 class="page-title">Bölüm Listesi</h1>
                <p class="page-subtitle">Direct ve Nested rotalar üzerinden fakülte bölümlerini ve bölüme özel iş ilanlarını inceleyin.</p>
              </div>
              <a href="/api/departments" target="_blank" class="btn btn-secondary">JSON API ↗</a>
            </div>

            <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr);">
              <div class="stat-card">
                <div class="stat-label">Kayıtlı Bölüm</div>
                <div class="stat-value"><span class="mint-dot"></span> ${departments.length}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Bölümlere Bağlı İlan</div>
                <div class="stat-value">${totalJobsAcrossDepts}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Nested Endpoint</div>
                <div class="stat-value" style="font-size: 14px; font-family: var(--font-mono); color: var(--brand-tag);">/departments/:id/job-postings</div>
              </div>
            </div>

            <section class="card-base">
              <div class="route-info">
                <strong>Direct ve Nested Rota Mimarisi:</strong><br>
                • <strong>Direct Rota:</strong> <span class="code-inline">GET /departments</span> (tüm bölümlerin listesi)<br>
                • <strong>Nested Rotalar:</strong> <span class="code-inline">GET /departments/:departmentId/job-postings</span> (Web HTML) ve
                <span class="code-inline">GET /api/departments/:departmentId/job-postings</span> (REST API)
              </div>

              <div class="table-wrap">
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
              </div>
            </section>
          </div>
        </main>

        ${MintlifyTheme.renderFooter()}
      </body>
      </html>
    `;
  },

  renderDepartmentDetailPage(department, jobPostings = []) {
    const jobCards = jobPostings.length > 0
      ? jobPostings.map(j => `
          <div style="background: var(--surface-soft); padding: 16px 20px; border-radius: var(--rounded-md); margin-bottom: 12px; border: 1px solid var(--hairline-soft); display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;">
            <div>
              <div style="font-weight: 600; font-size: 15px; color: var(--ink);">${escapeHtml(j.title)}</div>
              <div style="color: var(--steel); font-size: 13px; margin-top: 4px;">
                ${escapeHtml(j.company)} • ${escapeHtml(j.location || 'İstanbul')} • <span class="badge-type">${escapeHtml(j.job_type)}</span>
              </div>
            </div>
            <a href="/job-postings/${j.id}" class="btn btn-secondary btn-sm">İlan Detayı →</a>
          </div>
        `).join('')
      : `<p style="color: var(--steel); font-size: 14px;">Bu bölüme henüz atanmış açık bir iş/staj ilanı bulunmamaktadır.</p>`;

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${escapeHtml(department.name)} — Bölüm Detayı</title>
        <style>
          ${MintlifyTheme.getBaseStyles()}
        </style>
      </head>
      <body>
        ${MintlifyTheme.renderHeader('departments')}

        <main class="page-main">
          <div class="page-container" style="max-width: 880px;">
            <div style="margin-bottom: 18px;">
              <a href="/departments" class="btn btn-secondary btn-sm">← Bölüm Listesine Dön</a>
            </div>

            <div class="card-base">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                <span class="badge-tag">${escapeHtml(department.code)}</span>
                <span class="code-inline">#${department.id}</span>
              </div>
              <h1 class="page-title" style="margin-bottom: 6px;">${escapeHtml(department.name)}</h1>
              <p style="color: var(--steel); font-size: 15px; margin-bottom: 16px;">Fakülte: <strong style="color: var(--ink);">${escapeHtml(department.faculty)}</strong></p>
              <p style="line-height: 1.6; color: var(--charcoal); font-size: 15px;">${escapeHtml(department.description || 'Bölüm açıklaması girilmemiş.')}</p>

              <div class="action-cells" style="margin-top: 24px;">
                <a href="/departments/${department.id}/job-postings" class="btn btn-primary">Bu Bölümün İlanları (Nested Sayfa)</a>
                <a href="/api/departments/${department.id}/job-postings" target="_blank" class="btn btn-secondary">JSON API Rota ↗</a>
              </div>
            </div>

            <div class="card-base">
              <div class="card-title-row">
                <h2 class="card-heading">Bu Bölüme Özel Açılan İlanlar</h2>
                <span class="badge-green">${jobPostings.length} İlan</span>
              </div>
              ${jobCards}
            </div>
          </div>
        </main>

        ${MintlifyTheme.renderFooter()}
      </body>
      </html>
    `;
  }
};

module.exports = DepartmentViews;
