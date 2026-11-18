/**
 * HomeView - Istanbul University Management Information Systems (İÜ YBS)
 * Styled strictly in accordance with DESIGN.md (Mintlify Design System) via MintlifyTheme.
 * Preserves the full-bleed silent looping Beyazıt Gate hero video.
 */

const MintlifyTheme = require('./mintlifyTheme');
const { escapeHtml } = MintlifyTheme;

function getHomeSpecificStyles() {
  return `
    /* HERO BAND WITH SILENT FULL-BLEED VIDEO & MINTLIFY ATMOSPHERIC SCRIM */
    .hero-band {
      position: relative;
      overflow: hidden;
      padding: 88px 0 140px;
      background: linear-gradient(135deg, var(--hero-dark-from) 0%, var(--hero-dark-to) 100%);
      color: var(--on-dark);
    }

    .hero-video-wrapper {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      overflow: hidden;
    }

    .hero-bg-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      display: block;
      transform: translate3d(0, 0, 0);
      backface-visibility: hidden;
      will-change: transform;
      filter: brightness(0.86) contrast(1.05);
    }

    .hero-atmospheric-scrim {
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background: linear-gradient(
        180deg,
        rgba(10, 22, 26, 0.62) 0%,
        rgba(26, 61, 74, 0.45) 55%,
        rgba(10, 10, 10, 0.72) 100%
      );
    }

    .hero-inner {
      position: relative;
      z-index: 2;
      max-width: 820px;
      margin: 0 auto;
      text-align: center;
    }

    .hero-eyebrow-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(10, 10, 10, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      color: var(--on-dark);
      font-size: 13px;
      font-weight: 500;
      padding: 5px 14px;
      border-radius: var(--rounded-full);
      margin-bottom: 24px;
    }

    .hero-display {
      font-size: clamp(36px, 5.4vw, 68px);
      font-weight: 600;
      line-height: 1.05;
      letter-spacing: -2px;
      color: var(--on-dark);
      margin-bottom: 20px;
      text-shadow: 0 4px 24px rgba(0, 0, 0, 0.45);
    }

    .hero-subtitle {
      font-size: 18px;
      font-weight: 400;
      line-height: 1.50;
      color: rgba(255, 255, 255, 0.88);
      max-width: 620px;
      margin: 0 auto 32px;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
    }

    .hero-cta-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    /* FLOATING HERO PRODUCT MOCKUP (DESIGN.md hero-product-mockup) */
    .mockup-overlap-wrap {
      position: relative;
      z-index: 3;
      margin-top: -88px;
      margin-bottom: 64px;
    }

    .hero-product-mockup {
      background-color: var(--canvas);
      border: 1px solid var(--hairline-soft);
      border-radius: var(--rounded-lg);
      box-shadow: 0 24px 48px -8px rgba(0, 0, 0, 0.14);
      overflow: hidden;
    }

    .mockup-top-chrome {
      height: 48px;
      background-color: var(--canvas);
      border-bottom: 1px solid var(--hairline-soft);
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .mockup-brand-mini {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
      color: var(--ink);
    }

    .search-pill {
      background-color: var(--surface);
      color: var(--steel);
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-md);
      height: 32px;
      padding: 0 12px;
      font-size: 13px;
      display: inline-flex;
      align-items: center;
      gap: 16px;
      min-width: 240px;
      justify-content: space-between;
    }

    .kbd-chip {
      font-family: var(--font-mono);
      font-size: 11px;
      background: var(--canvas);
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-xs);
      padding: 1px 5px;
      color: var(--stone);
    }

    .mockup-grid {
      display: grid;
      grid-template-columns: 230px 1fr;
      min-height: 360px;
    }

    .docs-sidebar {
      background-color: var(--surface-soft);
      border-right: 1px solid var(--hairline-soft);
      padding: 20px 12px;
    }

    .sidebar-section-header {
      font-size: 11px;
      font-weight: 600;
      line-height: 1.40;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: var(--steel);
      padding: 8px 12px 6px;
    }

    .sidebar-nav-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 7px 12px;
      border-radius: var(--rounded-sm);
      font-size: 14px;
      font-weight: 400;
      color: var(--steel);
      text-decoration: none;
      margin-bottom: 2px;
      transition: background-color 0.15s ease, color 0.15s ease;
    }

    .sidebar-nav-item:hover {
      background-color: var(--surface);
      color: var(--ink);
    }

    .sidebar-nav-item.active {
      background-color: var(--surface);
      color: var(--ink);
      font-weight: 500;
    }

    .sidebar-count {
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--stone);
    }

    .mockup-prose {
      background-color: var(--canvas);
      padding: 24px 28px;
    }

    .mockup-prose-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }

    .mockup-prose-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--ink);
      letter-spacing: -0.3px;
    }

    .pill-tabs-row {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    .pill-tab {
      background-color: var(--canvas);
      color: var(--steel);
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-full);
      padding: 5px 13px;
      font-family: var(--font-sans);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .pill-tab:hover {
      background-color: var(--surface);
      color: var(--ink);
    }

    .pill-tab.active {
      background-color: var(--primary);
      color: var(--on-primary);
      border-color: var(--primary);
    }

    .property-list { border-top: 1px solid var(--hairline-soft); }

    .property-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 14px 4px;
      border-bottom: 1px solid var(--hairline-soft);
      text-decoration: none;
      color: var(--ink);
      transition: background-color 0.15s ease;
    }

    .property-row:hover { background-color: var(--surface-soft); }

    .property-left { display: flex; flex-direction: column; gap: 4px; min-width: 0; }

    .property-top-line { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

    .property-title { font-size: 15px; font-weight: 600; color: var(--ink); }

    .property-desc { font-size: 13px; color: var(--steel); }

    .property-arrow { font-size: 14px; font-weight: 500; color: var(--steel); white-space: nowrap; }

    .property-row:hover .property-arrow { color: var(--brand-green-deep); }

    /* METRICS BAR */
    .metrics-section { padding: 24px 0 64px; }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-lg);
      background-color: var(--canvas);
      overflow: hidden;
    }

    .metric-cell {
      padding: 24px;
      border-right: 1px solid var(--hairline);
      text-decoration: none;
      color: inherit;
      transition: background-color 0.15s ease;
    }

    .metric-cell:last-child { border-right: none; }

    .metric-cell:hover { background-color: var(--surface-soft); }

    .metric-num {
      font-size: 36px;
      font-weight: 600;
      letter-spacing: -1px;
      color: var(--ink);
      line-height: 1.1;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .metric-label { font-size: 14px; color: var(--steel); font-weight: 500; }

    /* SECTIONS & CARDS */
    .section-band { padding: 64px 0; }

    .section-band-muted {
      background-color: var(--surface-soft);
      border-top: 1px solid var(--hairline-soft);
      border-bottom: 1px solid var(--hairline-soft);
    }

    .section-header-center { text-align: center; max-width: 680px; margin: 0 auto 48px; }

    .heading-2 {
      font-size: clamp(28px, 3.6vw, 40px);
      font-weight: 600;
      line-height: 1.15;
      letter-spacing: -0.8px;
      color: var(--ink);
      margin-bottom: 14px;
    }

    .section-sub { font-size: 17px; color: var(--steel); line-height: 1.50; }

    .cards-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }

    .cards-grid-3 .card-base { margin-bottom: 0; }

    .card-base:hover {
      box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);
      border-color: #d4d4d4;
    }

    .card-base-featured {
      border: 2px solid var(--brand-green);
      box-shadow: 0 8px 24px rgba(0, 212, 164, 0.08);
    }

    .card-top-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; }

    .check-badge {
      width: 28px;
      height: 28px;
      border-radius: var(--rounded-full);
      background-color: rgba(0, 212, 164, 0.14);
      color: var(--brand-annotate);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
    }

    .card-title { font-size: 19px; font-weight: 600; color: var(--ink); margin-bottom: 8px; letter-spacing: -0.2px; }

    .card-desc { font-size: 14px; color: var(--steel); line-height: 1.55; }

    .card-foot-link { font-size: 14px; font-weight: 500; color: var(--ink); display: inline-flex; align-items: center; gap: 4px; }

    /* SIGNATURE DUAL SHOWCASE */
    .signature-split { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: stretch; }

    .testimonial-card-feature {
      background-color: var(--testimonial-orange);
      color: var(--on-dark);
      border-radius: var(--rounded-lg);
      padding: 40px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 24px;
    }

    .testimonial-quote { font-size: 24px; font-weight: 600; line-height: 1.3; letter-spacing: -0.4px; }

    .testimonial-author { font-size: 14px; font-weight: 500; opacity: 0.92; }

    .code-panel {
      background-color: var(--surface-code);
      border-radius: var(--rounded-lg);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--hairline-dark);
    }

    .code-block-header {
      background-color: var(--surface-code);
      color: var(--on-dark-muted);
      border-bottom: 1px solid #2c2c2e;
      padding: 10px 16px;
      font-family: var(--font-mono);
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .copy-code-button {
      background: transparent;
      color: var(--on-dark-muted);
      border: 1px solid #3a3a3c;
      border-radius: var(--rounded-sm);
      font-family: var(--font-sans);
      font-size: 12px;
      padding: 3px 10px;
      cursor: pointer;
    }

    .copy-code-button:hover { color: var(--on-dark); border-color: var(--brand-green); }

    .code-block-pre {
      padding: 20px;
      font-family: var(--font-mono);
      font-size: 13px;
      line-height: 1.6;
      color: #f5f5f7;
      overflow-x: auto;
      margin: 0;
      flex: 1;
    }

    .tok-green { color: var(--brand-green); }
    .tok-blue { color: #79b8ff; }
    .tok-muted { color: #8e8e93; }

    .two-col-tables { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

    .feature-comparison-table {
      background-color: var(--canvas);
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-md);
      overflow: hidden;
    }

    .table-head-bar {
      background-color: var(--surface-soft);
      padding: 14px 20px;
      border-bottom: 1px solid var(--hairline);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: var(--steel);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .feature-comparison-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 15px 20px;
      border-bottom: 1px solid var(--hairline-soft);
      text-decoration: none;
      color: var(--ink);
      font-size: 14px;
      transition: background-color 0.15s ease;
    }

    .feature-comparison-row:last-child { border-bottom: none; }
    .feature-comparison-row:hover { background-color: var(--surface-soft); }

    @media (max-width: 1024px) {
      .cards-grid-3 { grid-template-columns: repeat(2, 1fr); }
      .signature-split, .two-col-tables { grid-template-columns: 1fr; }
      .mockup-grid { grid-template-columns: 1fr; }
      .docs-sidebar { border-right: none; border-bottom: 1px solid var(--hairline-soft); }
      .metrics-grid { grid-template-columns: repeat(2, 1fr); }
      .metric-cell:nth-child(2) { border-right: none; }
      .metric-cell:nth-child(1), .metric-cell:nth-child(2) { border-bottom: 1px solid var(--hairline); }
    }

    @media (max-width: 768px) {
      .search-pill { display: none; }
      .hero-band { padding: 64px 0 110px; }
      .cards-grid-3, .metrics-grid { grid-template-columns: 1fr; }
      .metric-cell { border-right: none; border-bottom: 1px solid var(--hairline); }
      .metric-cell:last-child { border-bottom: none; }
      .testimonial-card-feature { padding: 28px; }
    }
  `;
}

const HomeView = {
  renderHomePage({ users = [], jobPostings = [], applications = [], departments = [] } = {}) {
    const totalUsers = users.length;
    const totalJobs = jobPostings.length;
    const totalApps = applications.length;
    const totalDepts = departments.length;

    const alumniCount = users.filter(u => (u.role || '').toLowerCase() === 'alumni').length;
    const studentCount = users.filter(u => (u.role || '').toLowerCase() === 'student').length;
    const activeJobs = jobPostings.filter(j => j.is_active !== false);
    const displayJobs = (activeJobs.length > 0 ? activeJobs : jobPostings).slice(0, 5);

    const jobRowsHtml = displayJobs.length > 0
      ? displayJobs.map(job => {
          const jobType = escapeHtml(job.job_type || 'Full-time');
          const filterKey = jobType.toLowerCase();
          return `
            <a href="/job-postings/${job.id}" class="property-row" data-job-type="${filterKey}">
              <div class="property-left">
                <div class="property-top-line">
                  <span class="code-inline">#${job.id}</span>
                  <span class="property-title">${escapeHtml(job.title)}</span>
                  <span class="badge-type">${jobType}</span>
                  ${job.department_code ? `<span class="badge-tag">${escapeHtml(job.department_code)}</span>` : ''}
                </div>
                <div class="property-desc">
                  ${escapeHtml(job.company)} • ${escapeHtml(job.location || 'İstanbul')}
                </div>
              </div>
              <span class="property-arrow">İncele →</span>
            </a>
          `;
        }).join('')
      : `
        <div style="padding: 28px 4px; font-size: 14px; color: var(--steel);">
          Henüz aktif ilan bulunmamaktadır. <a href="/job-postings" style="color: var(--brand-annotate); font-weight: 500;">Yeni ilan ekleyin →</a>
        </div>
      `;

    const deptRowsHtml = departments.length > 0
      ? departments.slice(0, 5).map(d => `
          <a href="/departments/${d.id}/job-postings" class="feature-comparison-row">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="badge-tag">${escapeHtml(d.code)}</span>
              <span style="font-weight: 500;">${escapeHtml(d.name)}</span>
            </div>
            <span class="badge-type">${d.jobPostingsCount || 0} İlan →</span>
          </a>
        `).join('')
      : `
        <a href="/departments" class="feature-comparison-row">
          <span>Yönetim Bilişim Sistemleri</span>
          <span class="badge-type">Bölümler →</span>
        </a>
      `;

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>İstanbul Üniversitesi YBS — Mezun ve Kariyer Bilgi Sistemi</title>
        <style>
          ${MintlifyTheme.getBaseStyles()}
          ${getHomeSpecificStyles()}
        </style>
      </head>
      <body>
        ${MintlifyTheme.renderHeader('home')}

        <main class="page-main">
          <!-- HERO BAND WITH FULL-BLEED SILENT BEYAZIT VIDEO -->
          <section class="hero-band">
            <div class="hero-video-wrapper">
              <video
                id="heroGateVideo"
                class="hero-bg-video"
                autoplay
                muted
                loop
                playsinline
                webkit-playsinline
                preload="metadata"
                poster="/images/iu_tarihi_kapi.jpg"
                onended="this.currentTime = 0; this.play();"
                aria-label="İstanbul Üniversitesi Beyazıt Tarihi Ana Kapı Tanıtım Videosu">
                <source src="/videos/main(1).mov" type="video/quicktime">
                <source src="/videos/main.mov" type="video/quicktime">
                <source src="/videos/main(1).mov" type="video/mp4">
                <source src="/videos/main.mov" type="video/mp4">
              </video>
              <div class="hero-atmospheric-scrim"></div>
            </div>

            <div class="container">
              <div class="hero-inner">
                <div class="hero-eyebrow-pill">
                  <span class="mint-dot"></span>
                  İKTİSAT FAKÜLTESİ • YÖNETİM BİLİŞİM SİSTEMLERİ
                </div>
                <h1 class="hero-display">
                  Mezun, öğrenci ve kariyer köprüsü.
                </h1>
                <p class="hero-subtitle">
                  Türkiye'nin ilk üniversitesinde bilişim ve yönetim vizyonunu geleceğe taşıyoruz. İlanlar, başvurular ve akademik ağ tek platformda.
                </p>
                <div class="hero-cta-row">
                  <a href="/job-postings" class="btn btn-accent-green">İlanları İncele (${totalJobs})</a>
                  <a href="/users" class="btn btn-on-dark">Mezun Ağı (${totalUsers})</a>
                  <a href="/applications" class="btn btn-secondary-dark">Başvurular (${totalApps}) →</a>
                </div>
              </div>
            </div>
          </section>

          <!-- FLOATING MINTLIFY PRODUCT MOCKUP (LIVE PORTAL WORKSPACE) -->
          <section class="mockup-overlap-wrap">
            <div class="container">
              <div class="hero-product-mockup">
                <div class="mockup-top-chrome">
                  <div class="mockup-brand-mini">
                    <span class="mint-dot"></span>
                    <span>İÜ YBS Portal Dokümantasyonu & Canlı Akış</span>
                  </div>
                  <div class="search-pill">
                    <span>İlan, mezun veya bölüm ara...</span>
                    <span class="kbd-chip">⌘K</span>
                  </div>
                </div>

                <div class="mockup-grid">
                  <aside class="docs-sidebar">
                    <div class="sidebar-section-header">MODÜLLER</div>
                    <a href="/job-postings" class="sidebar-nav-item active">
                      <span>İş & Staj İlanları</span>
                      <span class="sidebar-count">${totalJobs}</span>
                    </a>
                    <a href="/applications" class="sidebar-nav-item">
                      <span>Başvuru Takibi</span>
                      <span class="sidebar-count">${totalApps}</span>
                    </a>
                    <a href="/users" class="sidebar-nav-item">
                      <span>Mezun & Üye Dizini</span>
                      <span class="sidebar-count">${totalUsers}</span>
                    </a>
                    <a href="/departments" class="sidebar-nav-item">
                      <span>Akademik Bölümler</span>
                      <span class="sidebar-count">${totalDepts}</span>
                    </a>
                    <a href="/announcements" class="sidebar-nav-item">
                      <span>Duyurular</span>
                      <span class="sidebar-count">→</span>
                    </a>

                    <div class="sidebar-section-header" style="margin-top: 14px;">GELİŞTİRİCİ</div>
                    <a href="/api/swagger" target="_blank" class="sidebar-nav-item">
                      <span>Swagger OpenAPI</span>
                      <span class="sidebar-count">↗</span>
                    </a>
                    <a href="/about" class="sidebar-nav-item">
                      <span>Sistem Mimarisi</span>
                      <span class="sidebar-count">MVC</span>
                    </a>
                  </aside>

                  <div class="mockup-prose">
                    <div class="mockup-prose-head">
                      <div class="mockup-prose-title">Son Açılan Kariyer İlanları</div>
                      <div class="pill-tabs-row" role="tablist" aria-label="İlan Türü Filtresi">
                        <button type="button" class="pill-tab active" data-filter="all">Tümü (${displayJobs.length})</button>
                        <button type="button" class="pill-tab" data-filter="full-time">Full-time</button>
                        <button type="button" class="pill-tab" data-filter="internship">Internship</button>
                        <button type="button" class="pill-tab" data-filter="remote">Remote</button>
                      </div>
                    </div>

                    <div class="property-list" id="mintlifyJobFeed">
                      ${jobRowsHtml}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- LIVE METRICS BAR -->
          <section class="metrics-section">
            <div class="container">
              <div class="metrics-grid">
                <a href="/users" class="metric-cell">
                  <div class="metric-num"><span class="mint-dot"></span> ${totalUsers}</div>
                  <div class="metric-label">Kayıtlı Kullanıcı (${alumniCount} Mezun, ${studentCount} Öğrenci)</div>
                </a>
                <a href="/job-postings" class="metric-cell">
                  <div class="metric-num"><span class="mint-dot"></span> ${totalJobs}</div>
                  <div class="metric-label">Yayınlanan İş & Staj İlanı</div>
                </a>
                <a href="/applications" class="metric-cell">
                  <div class="metric-num"><span class="mint-dot"></span> ${totalApps}</div>
                  <div class="metric-label">Aktif İş / Staj Başvurusu</div>
                </a>
                <a href="/departments" class="metric-cell">
                  <div class="metric-num"><span class="mint-dot"></span> ${totalDepts}</div>
                  <div class="metric-label">Fakülte & Akademik Bölüm</div>
                </a>
              </div>
            </div>
          </section>

          <!-- MODULES SECTION -->
          <section class="section-band section-band-muted">
            <div class="container">
              <div class="section-header-center">
                <span class="section-kicker">PLATFORM MODÜLLERİ</span>
                <h2 class="heading-2">Tüm mezun ve kariyer süreçleri için tasarlandı</h2>
                <p class="section-sub">
                  Direct ve Nested rotalar, PostgreSQL 16 veritabanı ve OpenAPI 3.0 altyapısı ile tek merkezden yönetim.
                </p>
              </div>

              <div class="cards-grid-3">
                <a href="/job-postings" class="card-base card-base-featured">
                  <div>
                    <div class="card-top-row" style="margin-bottom: 14px;">
                      <span class="check-badge">✓</span>
                      <span class="badge-green">${totalJobs} Aktif İlan</span>
                    </div>
                    <h3 class="card-title">İş & Staj İlanları</h3>
                    <p class="card-desc">
                      Yazılım, veri analitiği ve danışmanlık alanlarındaki güncel fırsatları listeleyin, filtreleyin ve yeni ilan oluşturun.
                    </p>
                  </div>
                  <span class="card-foot-link">İlanları İncele →</span>
                </a>

                <a href="/applications" class="card-base">
                  <div>
                    <div class="card-top-row" style="margin-bottom: 14px;">
                      <span class="check-badge">✓</span>
                      <span class="code-inline">GET /applications</span>
                    </div>
                    <h3 class="card-title">Başvuru Takibi</h3>
                    <p class="card-desc">
                      Adayların CV bağlantılarını, ön yazılarını ve değerlendirme statülerini (Beklemede, İnceleniyor, Kabul, Ret) yönetin.
                    </p>
                  </div>
                  <span class="card-foot-link">Başvurulara Git →</span>
                </a>

                <a href="/departments" class="card-base">
                  <div>
                    <div class="card-top-row" style="margin-bottom: 14px;">
                      <span class="check-badge">✓</span>
                      <span class="code-inline">Nested Routes</span>
                    </div>
                    <h3 class="card-title">Bölümler & İlanlar</h3>
                    <p class="card-desc">
                      İktisat Fakültesi bölümlerini ve bölümlere hedeflenmiş ilanları ilişkisel rotalarla keşfedin.
                    </p>
                  </div>
                  <span class="card-foot-link">Bölümleri Gör →</span>
                </a>

                <a href="/users" class="card-base">
                  <div>
                    <div class="card-top-row" style="margin-bottom: 14px;">
                      <span class="check-badge">✓</span>
                      <span class="code-inline">${totalUsers} Üye</span>
                    </div>
                    <h3 class="card-title">Mezun & Öğrenci Ağı</h3>
                    <p class="card-desc">
                      Mezunlar, aktif öğrenciler ve akademisyen profillerini görüntüleyin ve yeni kullanıcı kayıtları oluşturun.
                    </p>
                  </div>
                  <span class="card-foot-link">Topluluğa Git →</span>
                </a>

                <a href="/announcements" class="card-base">
                  <div>
                    <div class="card-top-row" style="margin-bottom: 14px;">
                      <span class="check-badge">✓</span>
                      <span class="code-inline">Duyurular</span>
                    </div>
                    <h3 class="card-title">Duyurular & Etkinlikler</h3>
                    <p class="card-desc">
                      Kariyer günleri, mezunlar buluşması, hackathonlar ve bölüm duyurularını anlık olarak takip edin.
                    </p>
                  </div>
                  <span class="card-foot-link">Duyuruları Oku →</span>
                </a>

                <a href="/api/swagger" target="_blank" class="card-base">
                  <div>
                    <div class="card-top-row" style="margin-bottom: 14px;">
                      <span class="check-badge">✓</span>
                      <span class="badge-tag">OpenAPI 3.0</span>
                    </div>
                    <h3 class="card-title">Swagger REST API</h3>
                    <p class="card-desc">
                      Tüm JSON API uç noktalarını interaktif Swagger UI dokümantasyonu üzerinden canlı olarak test edin.
                    </p>
                  </div>
                  <span class="card-foot-link">Swagger UI'yi Aç →</span>
                </a>
              </div>
            </div>
          </section>

          <!-- SIGNATURE MINTLIFY ORANGE HIGHLIGHT CARD + DARK CODE BLOCK -->
          <section class="section-band">
            <div class="container">
              <div class="signature-split">
                <div class="testimonial-card-feature">
                  <div>
                    <span style="font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; opacity: 0.9;">İÜ YBS VİZYONU</span>
                    <blockquote class="testimonial-quote" style="margin-top: 12px;">
                      “1453'ten bugüne uzanan köklü akademik mirasımızı, veri odaklı modern yazılım mimarisiyle buluşturarak mezunlarımız ve öğrencilerimiz arasında kalıcı bir köprü kuruyoruz.”
                    </blockquote>
                  </div>
                  <div class="testimonial-author">
                    İstanbul Üniversitesi İktisat Fakültesi • Yönetim Bilişim Sistemleri Bölümü
                  </div>
                </div>

                <div class="code-panel">
                  <div class="code-block-header">
                    <span>api-endpoints.sh — REST & Nested Rotalar</span>
                    <button type="button" class="copy-code-button" id="copyApiSnippet">Kopyala</button>
                  </div>
                  <pre class="code-block-pre" id="apiCodeContent"><span class="tok-muted"># Tüm aktif iş & staj ilanlarını JSON olarak getir</span>
<span class="tok-green">curl</span> <span class="tok-blue">http://localhost:3000/api/job-postings</span>

<span class="tok-muted"># Bölüme özel hedeflenmiş ilanlar (Nested Route)</span>
<span class="tok-green">curl</span> <span class="tok-blue">http://localhost:3000/api/departments/1/job-postings</span>

<span class="tok-muted"># Sistem sağlık durumu ve PostgreSQL bağlantısı</span>
<span class="tok-green">curl</span> <span class="tok-blue">http://localhost:3000/api/health</span></pre>
                </div>
              </div>
            </div>
          </section>

          <!-- DEPARTMENTS & ACADEMIC FOCUS TABLES -->
          <section class="section-band section-band-muted">
            <div class="container">
              <div class="two-col-tables">
                <div>
                  <h3 style="font-size: 22px; font-weight: 600; color: var(--ink); margin-bottom: 16px;">Bölümler & Nested İlanlar</h3>
                  <div class="feature-comparison-table">
                    <div class="table-head-bar">
                      <span>BÖLÜM ADI</span>
                      <span>İLAN ROTASI</span>
                    </div>
                    ${deptRowsHtml}
                  </div>
                </div>

                <div>
                  <h3 style="font-size: 22px; font-weight: 600; color: var(--ink); margin-bottom: 16px;">YBS Akademik Odak Alanları</h3>
                  <div class="feature-comparison-table">
                    <div class="table-head-bar">
                      <span>DİSİPLİN</span>
                      <span>ALAN</span>
                    </div>
                    <div class="feature-comparison-row">
                      <span style="font-weight: 500;">01. Veri Bilimi & İş Zekası</span>
                      <span class="badge-type">Analytics</span>
                    </div>
                    <div class="feature-comparison-row">
                      <span style="font-weight: 500;">02. Kurumsal Yazılım & Web Mimarisi</span>
                      <span class="badge-type">Full-Stack</span>
                    </div>
                    <div class="feature-comparison-row">
                      <span style="font-weight: 500;">03. Siber Güvenlik & BT Yönetişimi</span>
                      <span class="badge-type">Governance</span>
                    </div>
                    <div class="feature-comparison-row">
                      <span style="font-weight: 500;">04. Yapay Zeka & Süreç Otomasyonu</span>
                      <span class="badge-type">AI / ML</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        ${MintlifyTheme.renderFooter()}

        <!-- SILENT HERO VIDEO OPTIMIZATIONS + MOCKUP TAB FILTER + COPY SNIPPET -->
        <script>
          (function() {
            const video = document.getElementById('heroGateVideo');
            if (video) {
              video.muted = true;
              video.volume = 0;

              if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver(function(entries) {
                  entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                      if (video.paused) video.play().catch(function() {});
                    } else {
                      if (!video.paused) video.pause();
                    }
                  });
                }, { threshold: 0.15 });
                observer.observe(video);
              }

              video.addEventListener('ended', function() {
                video.currentTime = 0;
                video.play().catch(function() {});
              });

              const playPromise = video.play();
              if (playPromise !== undefined) {
                playPromise.catch(function() {
                  video.muted = true;
                  video.play().catch(function() {});
                });
              }
            }

            const tabs = document.querySelectorAll('.pill-tab');
            const rows = document.querySelectorAll('#mintlifyJobFeed .property-row');
            tabs.forEach(function(tab) {
              tab.addEventListener('click', function() {
                tabs.forEach(function(t) { t.classList.remove('active'); });
                tab.classList.add('active');
                const filter = tab.getAttribute('data-filter');
                rows.forEach(function(row) {
                  const type = row.getAttribute('data-job-type') || '';
                  row.style.display = (filter === 'all' || type.indexOf(filter) !== -1) ? 'flex' : 'none';
                });
              });
            });

            const copyBtn = document.getElementById('copyApiSnippet');
            const codeEl = document.getElementById('apiCodeContent');
            if (copyBtn && codeEl && navigator.clipboard) {
              copyBtn.addEventListener('click', function() {
                navigator.clipboard.writeText(codeEl.innerText).then(function() {
                  copyBtn.textContent = 'Kopyalandı ✓';
                  setTimeout(function() { copyBtn.textContent = 'Kopyala'; }, 1800);
                }).catch(function() {});
              });
            }
          })();
        </script>
      </body>
      </html>
    `;
  },

  renderAboutPage() {
    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hakkında — İÜ YBS Mezun Takip Sistemi</title>
        <style>
          ${MintlifyTheme.getBaseStyles()}

          .about-wrap {
            max-width: 820px;
            margin: 56px auto 88px;
            padding: 0 24px;
          }

          .about-title {
            font-size: 32px;
            font-weight: 600;
            letter-spacing: -0.6px;
            color: var(--ink);
            margin-bottom: 14px;
          }

          .about-text {
            font-size: 16px;
            color: var(--steel);
            line-height: 1.6;
            margin-bottom: 24px;
          }
        </style>
      </head>
      <body>
        ${MintlifyTheme.renderHeader('about')}

        <main class="page-main about-wrap">
          <div class="card-base" style="padding: 36px;">
            <span class="section-kicker"><span class="mint-dot"></span> MİMARİ & PROJE BİLGİSİ</span>
            <h1 class="about-title">İÜ YBS Mezun Takip Sistemi</h1>
            <p class="about-text">
              Bu sistem, <strong style="color: var(--ink);">İstanbul Üniversitesi İktisat Fakültesi Yönetim Bilişim Sistemleri Bölümü</strong> bünyesinde geliştirilen; mezunlar, öğrenciler ve akademisyenler arasındaki bağı güçlendirmeyi amaçlayan kapsamlı bir web uygulamasıdır.
            </p>

            <div class="table-wrap" style="margin-bottom: 28px;">
              <table>
                <thead>
                  <tr>
                    <th>Bileşen</th>
                    <th>Teknoloji / Standart</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Katmanlı MVC Mimarisi</td>
                    <td><span class="code-inline">Node.js + Express.js</span></td>
                  </tr>
                  <tr>
                    <td>İlişkisel Veritabanı & Konteyner</td>
                    <td><span class="code-inline">PostgreSQL 16 + Docker</span></td>
                  </tr>
                  <tr>
                    <td>Direct & Nested Rotalar</td>
                    <td><span class="code-inline">/departments/:id/job-postings</span></td>
                  </tr>
                  <tr>
                    <td>API Dokümantasyonu</td>
                    <td><span class="badge-tag">OpenAPI 3.0 Swagger</span></td>
                  </tr>
                  <tr>
                    <td>Arayüz Tasarım Dili</td>
                    <td><span class="badge-green">Mintlify DESIGN.md</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <a href="/home" class="btn btn-primary">Ana Sayfaya Dön</a>
              <a href="/api/swagger" target="_blank" class="btn btn-secondary">Swagger API'yi Aç</a>
            </div>
          </div>
        </main>

        ${MintlifyTheme.renderFooter()}
      </body>
      </html>
    `;
  }
};

module.exports = HomeView;
