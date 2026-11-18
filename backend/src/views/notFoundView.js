/**
 * NotFoundView - Generic 404 View Layer
 * Styled consistently with DESIGN.md (Mintlify Design System) via MintlifyTheme.
 */

const MintlifyTheme = require('./mintlifyTheme');
const { escapeHtml } = MintlifyTheme;

const NotFoundView = {
  renderNotFoundPage({ requestedUrl = '', reason = '', method = 'GET' } = {}) {
    const displayUrl = escapeHtml(requestedUrl || 'Bilinmeyen Sayfa');
    const displayReason = escapeHtml(reason || 'Ulaşmaya çalıştığınız sayfa veya kaynak sistemde bulunamadı ya da kaldırılmış olabilir.');

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 Sayfa Bulunamadı — İÜ YBS</title>
        <style>
          ${MintlifyTheme.getBaseStyles()}

          .not-found-wrap {
            max-width: 680px;
            margin: 64px auto 88px;
            padding: 0 24px;
          }

          .not-found-card {
            background-color: var(--canvas);
            border: 1px solid var(--hairline);
            border-radius: var(--rounded-lg);
            padding: 44px 36px;
            text-align: center;
          }

          .big-code {
            font-size: 84px;
            font-weight: 700;
            letter-spacing: -3px;
            line-height: 1;
            color: var(--ink);
            margin-bottom: 12px;
          }

          .reason-panel {
            background-color: var(--surface-soft);
            border: 1px solid var(--hairline);
            border-left: 3px solid var(--brand-error);
            border-radius: var(--rounded-md);
            padding: 18px 20px;
            text-align: left;
            margin: 24px 0 28px;
          }
        </style>
      </head>
      <body>
        ${MintlifyTheme.renderHeader('')}

        <main class="page-main not-found-wrap">
          <div class="not-found-card">
            <span class="badge-error" style="margin-bottom: 16px;">404 GUARDIAN</span>
            <div class="big-code">404</div>
            <h1 style="font-size: 26px; font-weight: 600; color: var(--ink); margin-bottom: 10px;">
              Aradığınız Sayfa Bulunamadı
            </h1>
            <p style="font-size: 15px; color: var(--steel);">
              İstediğiniz adres sistemimizde kayıtlı bir sayfaya veya kaynağa işaret etmiyor.
            </p>

            <div class="reason-panel">
              <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--brand-error); margin-bottom: 6px;">
                Geçersiz İstek / Hata Sebebi
              </div>
              <div style="font-size: 14px; color: var(--charcoal); line-height: 1.55;">
                ${displayReason}
              </div>
              <div style="margin-top: 10px;">
                <span class="code-inline">${escapeHtml(method)} ${displayUrl}</span>
              </div>
            </div>

            <div class="action-cells" style="justify-content: center;">
              <a href="/home" class="btn btn-primary">Ana Sayfaya Dön</a>
              <a href="/job-postings" class="btn btn-accent-green">İş İlanlarını İncele</a>
              <a href="/api/swagger" target="_blank" class="btn btn-secondary">Swagger API</a>
            </div>
          </div>
        </main>

        ${MintlifyTheme.renderFooter()}
      </body>
      </html>
    `;
  }
};

module.exports = NotFoundView;
