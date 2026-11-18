/**
 * MintlifyTheme - Centralized Design System Module
 * Implements DESIGN.md (Mintlify Design Language) consistently across every page.
 */

function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const MintlifyTheme = {
  escapeHtml,

  getBaseStyles() {
    return `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');

      :root {
        /* DESIGN.md Mintlify Color Tokens */
        --primary: #0a0a0a;
        --on-primary: #ffffff;
        --brand-green: #00d4a4;
        --brand-green-deep: #00b48a;
        --brand-green-soft: #7cebcb;
        --brand-tag: #3772cf;
        --brand-warn: #c37d0d;
        --brand-annotate: #1ba673;
        --brand-error: #d45656;
        --hero-sky-from: #87a8c8;
        --hero-sky-to: #f5e9d8;
        --hero-dark-from: #1a3d4a;
        --hero-dark-to: #2d5a4f;
        --testimonial-orange: #f55a3c;
        --testimonial-orange-deep: #cc3a1f;
        --canvas: #ffffff;
        --canvas-dark: #0a0a0a;
        --surface: #f7f7f7;
        --surface-soft: #fafafa;
        --surface-code: #1c1c1e;
        --hairline: #e5e5e5;
        --hairline-soft: #ededed;
        --hairline-dark: #1f1f1f;
        --ink: #0a0a0a;
        --charcoal: #1c1c1e;
        --slate: #3a3a3c;
        --steel: #5a5a5c;
        --stone: #888888;
        --muted: #a8a8aa;
        --on-dark: #ffffff;
        --on-dark-muted: #b3b3b3;

        --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        --font-mono: 'Geist Mono', 'SF Mono', Menlo, Consolas, monospace;
        --rounded-xs: 4px;
        --rounded-sm: 6px;
        --rounded-md: 8px;
        --rounded-lg: 12px;
        --rounded-xl: 16px;
        --rounded-xxl: 24px;
        --rounded-full: 9999px;
      }

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      html {
        scroll-behavior: smooth;
        background-color: var(--canvas);
        color: var(--ink);
      }

      body {
        font-family: var(--font-sans);
        background-color: var(--canvas);
        color: var(--charcoal);
        font-size: 16px;
        font-weight: 400;
        line-height: 1.50;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
      }

      .page-main {
        flex: 1;
      }

      .container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 32px;
      }

      .page-container {
        max-width: 1200px;
        margin: 40px auto 72px;
        padding: 0 32px;
      }

      /* TOP PROMO BANNER */
      .promo-banner {
        background-color: var(--canvas-dark);
        color: var(--on-dark);
        font-size: 13px;
        font-weight: 500;
        padding: 10px 16px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
      }

      .promo-pill {
        background-color: var(--brand-green);
        color: var(--primary);
        font-size: 11px;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: var(--rounded-full);
        letter-spacing: 0.4px;
        text-transform: uppercase;
      }

      .promo-banner a {
        color: var(--brand-green-soft);
        text-decoration: none;
        font-weight: 500;
      }

      /* TOP NAVIGATION (Marketing sticky white bar) */
      .top-nav {
        position: sticky;
        top: 0;
        z-index: 1000;
        height: 64px;
        background-color: rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-bottom: 1px solid var(--hairline-soft);
      }

      .top-nav-inner {
        max-width: 1280px;
        height: 100%;
        margin: 0 auto;
        padding: 0 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
      }

      .nav-left {
        display: flex;
        align-items: center;
        gap: 32px;
      }

      .brand-wordmark {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        color: var(--ink);
        font-size: 16px;
        font-weight: 600;
        letter-spacing: -0.3px;
        flex-shrink: 0;
      }

      .brand-leaf {
        width: 26px;
        height: 26px;
        border-radius: var(--rounded-full);
        background: linear-gradient(135deg, var(--brand-green) 0%, var(--brand-green-deep) 100%);
        color: var(--primary);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: -0.3px;
      }

      .nav-links {
        display: flex;
        align-items: center;
        gap: 20px;
      }

      .nav-link {
        color: var(--steel);
        text-decoration: none;
        font-size: 14px;
        font-weight: 400;
        line-height: 1.50;
        transition: color 0.15s ease;
        white-space: nowrap;
      }

      .nav-link:hover,
      .nav-link.active {
        color: var(--ink);
      }

      .nav-link.active {
        font-weight: 500;
        position: relative;
      }

      .nav-link.active::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: -6px;
        height: 2px;
        background-color: var(--brand-green);
        border-radius: var(--rounded-full);
      }

      .nav-actions {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
      }

      /* PILL BUTTONS (rounded-full universally per DESIGN.md) */
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-family: var(--font-sans);
        font-size: 14px;
        font-weight: 500;
        line-height: 1.30;
        padding: 10px 20px;
        min-height: 38px;
        border-radius: var(--rounded-full);
        text-decoration: none;
        cursor: pointer;
        border: 1px solid transparent;
        transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
        white-space: nowrap;
      }

      .btn-sm {
        padding: 6px 12px;
        min-height: 30px;
        font-size: 13px;
      }

      .btn-primary {
        background-color: var(--primary);
        color: var(--on-primary);
      }

      .btn-primary:hover,
      .btn-primary:active {
        background-color: var(--charcoal);
      }

      .btn-accent-green {
        background-color: var(--brand-green);
        color: var(--primary);
        font-weight: 600;
      }

      .btn-accent-green:hover {
        background-color: var(--brand-green-soft);
      }

      .btn-on-dark {
        background-color: var(--on-dark);
        color: var(--primary);
        font-weight: 500;
      }

      .btn-on-dark:hover {
        background-color: var(--surface);
      }

      .btn-secondary {
        background-color: transparent;
        color: var(--ink);
        border-color: var(--hairline);
      }

      .btn-secondary:hover {
        background-color: var(--surface);
      }

      .btn-secondary-dark {
        background-color: rgba(255, 255, 255, 0.12);
        color: var(--on-dark);
        border-color: rgba(255, 255, 255, 0.28);
        backdrop-filter: blur(8px);
      }

      .btn-secondary-dark:hover {
        background-color: rgba(255, 255, 255, 0.22);
      }

      .btn-ghost {
        background-color: transparent;
        color: var(--ink);
        border-radius: var(--rounded-md);
        padding: 8px 12px;
      }

      .btn-ghost:hover {
        background-color: var(--surface);
      }

      .btn-warn {
        background-color: rgba(195, 125, 13, 0.1);
        color: var(--brand-warn);
        border-color: rgba(195, 125, 13, 0.28);
      }

      .btn-warn:hover {
        background-color: rgba(195, 125, 13, 0.18);
      }

      .btn-danger {
        background-color: rgba(212, 86, 86, 0.1);
        color: var(--brand-error);
        border-color: rgba(212, 86, 86, 0.28);
      }

      .btn-danger:hover {
        background-color: rgba(212, 86, 86, 0.18);
      }

      .btn-nested {
        background-color: rgba(55, 114, 207, 0.1);
        color: var(--brand-tag);
        border-color: rgba(55, 114, 207, 0.25);
      }

      .btn-nested:hover {
        background-color: rgba(55, 114, 207, 0.18);
      }

      /* TYPOGRAPHY HELPERS */
      .mint-dot {
        width: 8px;
        height: 8px;
        border-radius: var(--rounded-full);
        background-color: var(--brand-green);
        display: inline-block;
        flex-shrink: 0;
      }

      .section-kicker {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        color: var(--brand-annotate);
        margin-bottom: 8px;
      }

      .page-header-block {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 16px;
        flex-wrap: wrap;
        margin-bottom: 28px;
        padding-bottom: 20px;
        border-bottom: 1px solid var(--hairline-soft);
      }

      .page-title {
        font-size: 32px;
        font-weight: 600;
        line-height: 1.15;
        letter-spacing: -0.6px;
        color: var(--ink);
      }

      .page-subtitle {
        font-size: 15px;
        color: var(--steel);
        margin-top: 6px;
      }

      /* CARDS & SURFACES */
      .card-base {
        background-color: var(--canvas);
        border: 1px solid var(--hairline);
        border-radius: var(--rounded-lg);
        padding: 24px;
        margin-bottom: 24px;
      }

      .card-feature {
        background-color: var(--surface);
        border: 1px solid var(--hairline);
        border-radius: var(--rounded-lg);
        padding: 24px;
        margin-bottom: 24px;
      }

      .card-title-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding-bottom: 14px;
        margin-bottom: 18px;
        border-bottom: 1px solid var(--hairline-soft);
        flex-wrap: wrap;
      }

      .card-heading {
        font-size: 18px;
        font-weight: 600;
        color: var(--ink);
        letter-spacing: -0.2px;
      }

      /* ROUTE INFO / CALLOUT BANNER */
      .route-info {
        background-color: var(--surface-soft);
        border: 1px solid var(--hairline);
        border-left: 3px solid var(--brand-green);
        border-radius: var(--rounded-md);
        padding: 14px 18px;
        margin-bottom: 20px;
        font-size: 14px;
        color: var(--slate);
        line-height: 1.55;
      }

      .route-info.nested-banner {
        border-left-color: var(--brand-tag);
        background-color: rgba(55, 114, 207, 0.04);
      }

      /* BADGES & CODE */
      .code-inline {
        font-family: var(--font-mono);
        font-size: 12px;
        font-weight: 500;
        background-color: var(--surface);
        color: var(--charcoal);
        border: 1px solid var(--hairline);
        border-radius: var(--rounded-xs);
        padding: 2px 6px;
      }

      .badge-type {
        font-family: var(--font-mono);
        font-size: 12px;
        background-color: var(--surface);
        color: var(--steel);
        border: 1px solid var(--hairline-soft);
        border-radius: var(--rounded-sm);
        padding: 2px 8px;
        display: inline-block;
      }

      .badge-tag {
        font-size: 12px;
        font-weight: 600;
        background-color: rgba(55, 114, 207, 0.12);
        color: var(--brand-tag);
        border-radius: var(--rounded-sm);
        padding: 2px 8px;
        display: inline-block;
      }

      .badge-green {
        font-size: 12px;
        font-weight: 600;
        background-color: rgba(0, 212, 164, 0.16);
        color: var(--brand-annotate);
        border-radius: var(--rounded-full);
        padding: 2px 10px;
        display: inline-block;
      }

      .badge-warn {
        font-size: 12px;
        font-weight: 600;
        background-color: rgba(195, 125, 13, 0.12);
        color: var(--brand-warn);
        border-radius: var(--rounded-full);
        padding: 2px 10px;
        display: inline-block;
      }

      .badge-error {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.4px;
        text-transform: uppercase;
        background-color: var(--brand-error);
        color: var(--on-dark);
        border-radius: var(--rounded-sm);
        padding: 2px 6px;
        display: inline-block;
      }

      /* STATS GRID */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        border: 1px solid var(--hairline);
        border-radius: var(--rounded-lg);
        background-color: var(--canvas);
        margin-bottom: 24px;
        overflow: hidden;
      }

      .stat-card {
        padding: 20px 22px;
        border-right: 1px solid var(--hairline);
      }

      .stat-card:last-child {
        border-right: none;
      }

      .stat-label {
        font-size: 12px;
        font-weight: 500;
        color: var(--steel);
        text-transform: uppercase;
        letter-spacing: 0.4px;
      }

      .stat-value {
        font-size: 28px;
        font-weight: 600;
        color: var(--ink);
        letter-spacing: -0.6px;
        margin-top: 4px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      /* FORMS & INPUTS (DESIGN.md: 40px height, 8px radius, 2px solid #00d4a4 focus) */
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .form-group label {
        font-size: 13px;
        font-weight: 500;
        color: var(--charcoal);
      }

      .form-group input,
      .form-group select,
      .form-group textarea,
      .search-input {
        font-family: var(--font-sans);
        background-color: var(--canvas);
        color: var(--ink);
        border: 1px solid var(--hairline);
        border-radius: var(--rounded-md);
        padding: 8px 12px;
        font-size: 14px;
        transition: border-color 0.15s ease;
      }

      .form-group input,
      .form-group select,
      .search-input {
        height: 40px;
      }

      .form-group textarea {
        min-height: 96px;
        resize: vertical;
        padding: 10px 12px;
      }

      .form-group input:focus,
      .form-group select:focus,
      .form-group textarea:focus,
      .search-input:focus {
        outline: none;
        border: 2px solid var(--brand-green);
      }

      /* DATA TABLES (feature-comparison-table style) */
      .table-wrap {
        border: 1px solid var(--hairline);
        border-radius: var(--rounded-md);
        overflow-x: auto;
        background-color: var(--canvas);
      }

      table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
      }

      th {
        background-color: var(--surface-soft);
        padding: 12px 16px;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        color: var(--steel);
        border-bottom: 1px solid var(--hairline);
      }

      td {
        padding: 14px 16px;
        font-size: 14px;
        color: var(--charcoal);
        border-bottom: 1px solid var(--hairline-soft);
        vertical-align: middle;
      }

      tr:last-child td {
        border-bottom: none;
      }

      tr:hover td {
        background-color: var(--surface-soft);
      }

      .action-cells {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }

      /* SEARCH / FILTER BAR */
      .filter-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 16px;
        flex-wrap: wrap;
      }

      .search-input {
        background-color: var(--surface);
        min-width: 280px;
        flex: 1;
      }

      /* FOOTER */
      .footer-region {
        background-color: var(--canvas);
        border-top: 1px solid var(--hairline);
        padding: 56px 0 44px;
        margin-top: auto;
      }

      .footer-grid {
        display: grid;
        grid-template-columns: 1.5fr 1fr 1fr 1fr;
        gap: 32px;
      }

      .footer-col-title {
        font-size: 14px;
        font-weight: 500;
        color: var(--ink);
        margin-bottom: 14px;
      }

      .footer-links-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .footer-link {
        color: var(--steel);
        text-decoration: none;
        font-size: 14px;
        transition: color 0.15s ease;
      }

      .footer-link:hover {
        color: var(--ink);
      }

      .footer-meta-note {
        margin-top: 12px;
        font-size: 13px;
        color: var(--stone);
        line-height: 1.5;
      }

      @media (max-width: 1024px) {
        .stats-grid { grid-template-columns: repeat(2, 1fr); }
        .stat-card:nth-child(2) { border-right: none; }
        .stat-card:nth-child(1), .stat-card:nth-child(2) { border-bottom: 1px solid var(--hairline); }
        .footer-grid { grid-template-columns: 1fr 1fr; }
      }

      @media (max-width: 768px) {
        .container, .page-container, .top-nav-inner { padding: 0 18px; }
        .top-nav { height: auto; padding: 10px 0; }
        .top-nav-inner { flex-wrap: wrap; gap: 10px; }
        .nav-left { width: 100%; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
        .nav-links {
          width: 100%;
          overflow-x: auto;
          padding-bottom: 4px;
          gap: 14px;
          scrollbar-width: none;
        }
        .nav-links::-webkit-scrollbar { display: none; }
        .form-grid, .stats-grid, .footer-grid { grid-template-columns: 1fr; }
        .stat-card { border-right: none; border-bottom: 1px solid var(--hairline); }
        .stat-card:last-child { border-bottom: none; }
      }
    `;
  },

  renderHeader(activeTab = 'home') {
    return `
      <div class="promo-banner">
        <span class="promo-pill">1453</span>
        <span>T.C. İstanbul Üniversitesi İktisat Fakültesi — Yönetim Bilişim Sistemleri Portalı</span>
        <a href="/api/swagger" target="_blank">OpenAPI 3.0 Swagger →</a>
      </div>

      <header class="top-nav">
        <div class="top-nav-inner">
          <div class="nav-left">
            <a href="/home" class="brand-wordmark" aria-label="İstanbul Üniversitesi YBS Ana Sayfa">
              <span class="brand-leaf">İÜ</span>
              <span>YBS Portal</span>
            </a>

            <nav class="nav-links" aria-label="Ana Menü">
              <a href="/home" class="nav-link ${activeTab === 'home' ? 'active' : ''}">Ana Sayfa</a>
              <a href="/users" class="nav-link ${activeTab === 'users' ? 'active' : ''}">Mezunlar</a>
              <a href="/departments" class="nav-link ${activeTab === 'departments' ? 'active' : ''}">Bölümler</a>
              <a href="/job-postings" class="nav-link ${activeTab === 'job-postings' ? 'active' : ''}">İlanlar</a>
              <a href="/applications" class="nav-link ${activeTab === 'applications' ? 'active' : ''}">Başvurular</a>
              <a href="/announcements" class="nav-link ${activeTab === 'announcements' ? 'active' : ''}">Duyurular</a>
              <a href="/about" class="nav-link ${activeTab === 'about' ? 'active' : ''}">Hakkında</a>
            </nav>
          </div>

          <div class="nav-actions">
            <a href="/users" class="btn btn-secondary">Mezun Ağı</a>
            <a href="/api/swagger" target="_blank" class="btn btn-primary">Swagger API</a>
          </div>
        </div>
      </header>
    `;
  },

  renderFooter() {
    return `
      <footer class="footer-region">
        <div class="container">
          <div class="footer-grid">
            <div>
              <a href="/home" class="brand-wordmark">
                <span class="brand-leaf">İÜ</span>
                <span>YBS Mezun & Kariyer Portalı</span>
              </a>
              <p class="footer-meta-note">
                T.C. İstanbul Üniversitesi İktisat Fakültesi<br>
                Yönetim Bilişim Sistemleri Bölümü<br>
                Beyazıt Yerleşkesi, 34452 Fatih / İstanbul
              </p>
            </div>

            <div>
              <div class="footer-col-title">Portal</div>
              <div class="footer-links-list">
                <a href="/home" class="footer-link">Ana Sayfa</a>
                <a href="/job-postings" class="footer-link">İş & Staj İlanları</a>
                <a href="/applications" class="footer-link">Başvurular</a>
                <a href="/announcements" class="footer-link">Duyurular</a>
              </div>
            </div>

            <div>
              <div class="footer-col-title">Topluluk</div>
              <div class="footer-links-list">
                <a href="/users" class="footer-link">Mezunlar & Kullanıcılar</a>
                <a href="/departments" class="footer-link">Bölümler</a>
                <a href="/about" class="footer-link">Hakkında</a>
              </div>
            </div>

            <div>
              <div class="footer-col-title">Geliştirici</div>
              <div class="footer-links-list">
                <a href="/api/swagger" target="_blank" class="footer-link">Swagger API</a>
                <a href="/api/health" target="_blank" class="footer-link">Health Check</a>
                <a href="/api/job-postings" target="_blank" class="footer-link">JSON İlanlar</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
};

module.exports = MintlifyTheme;
