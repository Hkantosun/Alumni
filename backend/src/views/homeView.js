/**
 * HomeView - Istanbul University Management Information Systems (İÜ YBS)
 * Redesigned Editorial & Bento Home Page + About Page View Layer
 */

const SharedHeader = require('./sharedHeader');

function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getJobTypeBadgeStyle(jobType) {
  const t = (jobType || '').toLowerCase();
  if (t.includes('intern') || t.includes('staj')) {
    return 'background: rgba(168, 85, 247, 0.16); color: #d8b4fe; border: 1px solid rgba(168, 85, 247, 0.35);';
  }
  if (t.includes('remote') || t.includes('uzak')) {
    return 'background: rgba(16, 185, 129, 0.16); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.35);';
  }
  if (t.includes('part')) {
    return 'background: rgba(245, 158, 11, 0.16); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.35);';
  }
  return 'background: rgba(56, 189, 248, 0.16); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.35);';
}

const HomeView = {
  renderHomePage({ users = [], jobPostings = [], applications = [], departments = [] } = {}) {
    const totalUsers = users.length;
    const totalJobs = jobPostings.length;
    const totalApps = applications.length;
    const totalDepts = departments.length;

    // Live role distribution from PostgreSQL users
    const alumniCount = users.filter(u => (u.role || '').toLowerCase() === 'alumni').length;
    const studentCount = users.filter(u => (u.role || '').toLowerCase() === 'student').length;
    const academicCount = users.filter(u => {
      const r = (u.role || '').toLowerCase();
      return r === 'academic_staff' || r === 'admin';
    }).length;

    const safeTotalUsers = totalUsers || 1;
    const alumniPct = Math.round((alumniCount / safeTotalUsers) * 100);
    const studentPct = Math.round((studentCount / safeTotalUsers) * 100);
    const academicPct = Math.max(0, 100 - alumniPct - studentPct);

    // Active jobs and latest spotlight
    const activeJobs = jobPostings.filter(j => j.is_active !== false);
    const activeJobsCount = activeJobs.length;
    const featuredJob = activeJobs[0] || jobPostings[0] || null;
    const recentJobs = (activeJobs.length > 0 ? activeJobs : jobPostings).slice(0, 4);

    // Recent jobs HTML
    const recentJobsHtml = recentJobs.length > 0
      ? recentJobs.map(job => {
          const companyInitial = escapeHtml((job.company || 'Y').trim().charAt(0).toUpperCase());
          const badgeStyle = getJobTypeBadgeStyle(job.job_type);
          return `
            <a href="/job-postings/${job.id}" class="job-feed-item">
              <div class="job-feed-left">
                <div class="company-avatar">${companyInitial}</div>
                <div class="job-feed-meta">
                  <div class="job-feed-title">${escapeHtml(job.title)}</div>
                  <div class="job-feed-sub">
                    <span>🏢 ${escapeHtml(job.company)}</span>
                    <span class="dot-sep">•</span>
                    <span>📍 ${escapeHtml(job.location || 'İstanbul / Hibrit')}</span>
                    ${job.department_code ? `<span class="dot-sep">•</span><span class="dept-chip">${escapeHtml(job.department_code)}</span>` : ''}
                  </div>
                </div>
              </div>
              <div class="job-feed-right">
                <span class="job-type-pill" style="${badgeStyle}">${escapeHtml(job.job_type || 'Full-time')}</span>
                <span class="row-arrow">→</span>
              </div>
            </a>
          `;
        }).join('')
      : `<div class="empty-feed">Henüz yayınlanmış aktif ilan bulunmuyor. <a href="/job-postings">İlk ilanı ekleyin →</a></div>`;

    // Departments chips HTML
    const deptChipsHtml = departments.length > 0
      ? departments.slice(0, 6).map(d => `
          <a href="/departments/${d.id}/job-postings" class="dept-bento-chip">
            <div class="dept-chip-top">
              <span class="dept-code-tag">${escapeHtml(d.code)}</span>
              <span class="dept-count-tag">${d.jobPostingsCount || 0} İlan</span>
            </div>
            <div class="dept-chip-name">${escapeHtml(d.name)}</div>
          </a>
        `).join('')
      : `<div class="empty-feed">Bölüm verisi bulunamadı.</div>`;

    // Featured spotlight inside hero glass widget
    const heroSpotlightHtml = featuredJob
      ? `
        <a href="/job-postings/${featuredJob.id}" class="pulse-spotlight">
          <div class="spotlight-kicker">🔥 ÖNE ÇIKAN GÜNCEL İLAN</div>
          <div class="spotlight-title">${escapeHtml(featuredJob.title)}</div>
          <div class="spotlight-meta">
            <span>${escapeHtml(featuredJob.company)}</span>
            <span>•</span>
            <span>${escapeHtml(featuredJob.location || 'İstanbul')}</span>
          </div>
          <div class="spotlight-cta">İlanı İncele <span>→</span></div>
        </a>
      `
      : `
        <a href="/job-postings" class="pulse-spotlight">
          <div class="spotlight-kicker">💼 KARİYER FIRSATLARI</div>
          <div class="spotlight-title">Mezun & Staj İlanlarını Keşfedin</div>
          <div class="spotlight-meta">Güncel teknoloji ve yönetim pozisyonları</div>
          <div class="spotlight-cta">İlanlara Git <span>→</span></div>
        </a>
      `;

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>İstanbul Üniversitesi YBS - Mezun ve Kariyer Bilgi Sistemi</title>
        <style>
          ${SharedHeader.getHeaderStyles()}

          :root {
            --bg: #070a12;
            --surface: #0d1322;
            --card-bg: #131b2e;
            --card-hover: #19243d;
            --iu-burgundy: #800020;
            --iu-gold: #d4af37;
            --iu-gold-glow: rgba(212, 175, 55, 0.22);
            --accent: #38bdf8;
            --coral: #e86034;
            --purple: #a855f7;
            --emerald: #10b981;
            --amber: #f59e0b;
            --text: #f8fafc;
            --muted: #94a3b8;
            --border: rgba(255, 255, 255, 0.08);
            --border-gold: rgba(212, 175, 55, 0.32);
          }

          * { box-sizing: border-box; margin: 0; padding: 0; }

          html { scroll-behavior: smooth; }

          body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: var(--bg);
            color: var(--text);
            line-height: 1.6;
            overflow-x: hidden;
          }

          /* 1. CINEMATIC SPLIT EDITORIAL HERO WITH SILENT FULL-BLEED VIDEO */
          .hero-section {
            position: relative;
            min-height: 640px;
            overflow: hidden;
            display: flex;
            align-items: center;
            padding: 5rem 2rem 4.5rem;
            border-bottom: 1px solid var(--border);
            background: #070a12;
          }

          .hero-video-wrapper {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 0;
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
            filter: brightness(0.88) contrast(1.06);
          }

          .hero-video-overlay {
            position: absolute;
            inset: 0;
            background:
              radial-gradient(circle at 75% 40%, rgba(212, 175, 55, 0.08) 0%, transparent 55%),
              linear-gradient(
                105deg,
                rgba(7, 10, 18, 0.94) 0%,
                rgba(7, 10, 18, 0.78) 48%,
                rgba(7, 10, 18, 0.42) 100%
              );
            pointer-events: none;
            z-index: 1;
          }

          .hero-content {
            max-width: 1320px;
            margin: 0 auto;
            width: 100%;
            display: grid;
            grid-template-columns: 1.25fr 0.85fr;
            gap: 3.5rem;
            align-items: center;
            position: relative;
            z-index: 2;
          }

          .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.55rem;
            background: rgba(212, 175, 55, 0.12);
            border: 1px solid var(--border-gold);
            color: var(--iu-gold);
            padding: 0.42rem 1rem;
            border-radius: 9999px;
            font-size: 0.78rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            margin-bottom: 1.35rem;
            backdrop-filter: blur(8px);
          }

          .hero-title {
            font-family: 'Cinzel', serif;
            font-size: clamp(2.1rem, 3.8vw, 3.25rem);
            font-weight: 800;
            line-height: 1.15;
            color: #ffffff;
            margin-bottom: 1rem;
            text-shadow: 0 6px 28px rgba(0, 0, 0, 0.75);
          }

          .hero-title span {
            display: block;
            margin-top: 0.2rem;
            background: linear-gradient(120deg, #f3d573 0%, #d4af37 45%, #38bdf8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .hero-subtitle {
            font-size: 1.2rem;
            font-weight: 600;
            color: #e2e8f0;
            margin-bottom: 0.85rem;
          }

          .hero-desc {
            font-size: 1rem;
            color: #cbd5e1;
            line-height: 1.7;
            margin-bottom: 2.1rem;
            max-width: 600px;
          }

          .hero-actions {
            display: flex;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;
          }

          .cta-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.55rem;
            padding: 0.9rem 1.7rem;
            border-radius: 9999px;
            font-weight: 700;
            font-size: 0.93rem;
            text-decoration: none;
            transition: all 0.25s ease;
          }

          .cta-btn:hover { transform: translateY(-2px); }

          .cta-primary {
            background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
            color: #070a12;
            box-shadow: 0 10px 28px rgba(212, 175, 55, 0.35);
          }

          .cta-primary:hover {
            box-shadow: 0 14px 34px rgba(212, 175, 55, 0.5);
          }

          .cta-glass {
            background: rgba(15, 22, 38, 0.65);
            backdrop-filter: blur(12px);
            color: #f8fafc;
            border: 1px solid rgba(255, 255, 255, 0.18);
          }

          .cta-glass:hover {
            background: rgba(56, 189, 248, 0.18);
            border-color: var(--accent);
            color: #ffffff;
          }

          .cta-text-link {
            color: #cbd5e1;
            text-decoration: none;
            font-size: 0.92rem;
            font-weight: 600;
            padding: 0.5rem 0.75rem;
            transition: color 0.2s ease;
          }

          .cta-text-link:hover { color: var(--iu-gold); }

          /* HERO FLOATING LIVE PULSE GLASS PANEL */
          .hero-pulse-panel {
            background: rgba(11, 16, 30, 0.72);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-top-color: rgba(212, 175, 55, 0.45);
            border-radius: 22px;
            padding: 1.65rem;
            box-shadow: 0 28px 60px rgba(0, 0, 0, 0.65);
          }

          .pulse-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.25rem;
            padding-bottom: 0.85rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }

          .pulse-status {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 0.76rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            color: #e2e8f0;
          }

          .live-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--emerald);
            box-shadow: 0 0 12px var(--emerald);
            animation: pulse-dot 2s infinite;
          }

          @keyframes pulse-dot {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.8); }
          }

          .pulse-tech-tag {
            font-size: 0.72rem;
            font-weight: 600;
            color: var(--accent);
            background: rgba(56, 189, 248, 0.12);
            border: 1px solid rgba(56, 189, 248, 0.25);
            padding: 3px 10px;
            border-radius: 9999px;
          }

          .pulse-metrics-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.85rem;
            margin-bottom: 1.2rem;
          }

          .pulse-metric {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.07);
            border-radius: 14px;
            padding: 0.9rem 1rem;
            text-decoration: none;
            transition: all 0.2s ease;
          }

          .pulse-metric:hover {
            background: rgba(255, 255, 255, 0.07);
            border-color: rgba(212, 175, 55, 0.35);
            transform: translateY(-2px);
          }

          .pulse-metric-val {
            font-size: 1.65rem;
            font-weight: 800;
            line-height: 1.1;
            margin-bottom: 0.25rem;
          }

          .pulse-metric-lbl {
            font-size: 0.78rem;
            color: var(--muted);
            font-weight: 600;
          }

          .pulse-spotlight {
            display: block;
            text-decoration: none;
            background: linear-gradient(135deg, rgba(128, 0, 32, 0.28), rgba(15, 22, 38, 0.85));
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 14px;
            padding: 1rem 1.15rem;
            transition: all 0.25s ease;
          }

          .pulse-spotlight:hover {
            border-color: var(--iu-gold);
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
          }

          .spotlight-kicker {
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.07em;
            color: var(--iu-gold);
            margin-bottom: 0.35rem;
          }

          .spotlight-title {
            font-size: 1rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 0.25rem;
          }

          .spotlight-meta {
            display: flex;
            gap: 0.45rem;
            font-size: 0.8rem;
            color: #cbd5e1;
            margin-bottom: 0.5rem;
          }

          .spotlight-cta {
            font-size: 0.8rem;
            font-weight: 700;
            color: var(--accent);
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }

          /* 2. BENTO LIVE SHOWCASE SECTION */
          .bento-section {
            max-width: 1320px;
            margin: 0 auto;
            padding: 4rem 2rem 2rem;
          }

          .section-top-bar {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            gap: 1rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
          }

          .section-eyebrow {
            font-size: 0.78rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--iu-gold);
            margin-bottom: 0.35rem;
          }

          .section-title {
            font-family: 'Cinzel', serif;
            font-size: 1.9rem;
            font-weight: 700;
            color: #ffffff;
          }

          .section-desc {
            font-size: 0.96rem;
            color: var(--muted);
            max-width: 580px;
          }

          .section-action-link {
            color: var(--accent);
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 0.45rem 0.9rem;
            border-radius: 9999px;
            background: rgba(56, 189, 248, 0.1);
            border: 1px solid rgba(56, 189, 248, 0.25);
            transition: all 0.2s ease;
          }

          .section-action-link:hover {
            background: rgba(56, 189, 248, 0.2);
          }

          .bento-grid {
            display: grid;
            grid-template-columns: 1.35fr 0.95fr;
            gap: 1.5rem;
          }

          .bento-card {
            background: linear-gradient(155deg, #121a2d 0%, #0b101d 100%);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 1.75rem;
            box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
          }

          .bento-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.25rem;
          }

          .bento-card-title {
            font-size: 1.15rem;
            font-weight: 700;
            color: #f8fafc;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .bento-stack {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .job-feed-list {
            display: flex;
            flex-direction: column;
            gap: 0.85rem;
          }

          .job-feed-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
            padding: 1rem 1.15rem;
            border-radius: 14px;
            background: rgba(255, 255, 255, 0.025);
            border: 1px solid rgba(255, 255, 255, 0.06);
            text-decoration: none;
            color: inherit;
            transition: all 0.22s ease;
          }

          .job-feed-item:hover {
            background: rgba(56, 189, 248, 0.07);
            border-color: rgba(56, 189, 248, 0.35);
            transform: translateX(4px);
          }

          .job-feed-left {
            display: flex;
            align-items: center;
            gap: 0.95rem;
            min-width: 0;
          }

          .company-avatar {
            width: 42px;
            height: 42px;
            border-radius: 12px;
            background: linear-gradient(135deg, rgba(212, 175, 55, 0.22), rgba(56, 189, 248, 0.18));
            border: 1px solid rgba(212, 175, 55, 0.35);
            color: var(--iu-gold);
            font-family: 'Cinzel', serif;
            font-weight: 800;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .job-feed-meta { min-width: 0; }

          .job-feed-title {
            font-weight: 700;
            font-size: 0.98rem;
            color: #ffffff;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .job-feed-sub {
            font-size: 0.82rem;
            color: var(--muted);
            display: flex;
            align-items: center;
            gap: 0.45rem;
            flex-wrap: wrap;
            margin-top: 0.2rem;
          }

          .dot-sep { opacity: 0.45; }

          .dept-chip {
            color: #c084fc;
            font-weight: 600;
          }

          .job-feed-right {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            flex-shrink: 0;
          }

          .job-type-pill {
            font-size: 0.74rem;
            font-weight: 700;
            padding: 0.28rem 0.7rem;
            border-radius: 9999px;
          }

          .row-arrow {
            color: var(--muted);
            font-weight: 700;
            transition: transform 0.2s ease, color 0.2s ease;
          }

          .job-feed-item:hover .row-arrow {
            color: var(--accent);
            transform: translateX(3px);
          }

          /* COMMUNITY ROLE PROGRESS BARS */
          .role-bars {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .role-bar-row {
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
          }

          .role-bar-label {
            display: flex;
            justify-content: space-between;
            font-size: 0.85rem;
            font-weight: 600;
            color: #cbd5e1;
          }

          .role-track {
            height: 8px;
            border-radius: 9999px;
            background: rgba(255, 255, 255, 0.06);
            overflow: hidden;
          }

          .role-fill {
            height: 100%;
            border-radius: 9999px;
          }

          /* DEPARTMENTS BENTO CHIPS */
          .dept-chips-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }

          .dept-bento-chip {
            text-decoration: none;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.07);
            border-radius: 12px;
            padding: 0.85rem;
            transition: all 0.2s ease;
          }

          .dept-bento-chip:hover {
            border-color: rgba(168, 85, 247, 0.45);
            background: rgba(168, 85, 247, 0.08);
            transform: translateY(-2px);
          }

          .dept-chip-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.35rem;
          }

          .dept-code-tag {
            font-size: 0.72rem;
            font-weight: 800;
            color: #d8b4fe;
            background: rgba(168, 85, 247, 0.18);
            padding: 2px 7px;
            border-radius: 6px;
          }

          .dept-count-tag {
            font-size: 0.74rem;
            color: var(--muted);
            font-weight: 600;
          }

          .dept-chip-name {
            font-size: 0.84rem;
            font-weight: 600;
            color: #f1f5f9;
            line-height: 1.35;
          }

          .empty-feed {
            padding: 1.5rem;
            text-align: center;
            color: var(--muted);
            font-size: 0.92rem;
          }

          .empty-feed a { color: var(--accent); }

          /* 3. PLATFORM MODULES GRID */
          .modules-section {
            max-width: 1320px;
            margin: 0 auto;
            padding: 3.5rem 2rem;
          }

          .modules-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.35rem;
          }

          .module-card {
            background: linear-gradient(155deg, #131b2e 0%, #0d1322 100%);
            border: 1px solid var(--border);
            border-radius: 18px;
            padding: 1.75rem;
            text-decoration: none;
            color: var(--text);
            display: flex;
            flex-direction: column;
            gap: 0.85rem;
            transition: all 0.25s ease;
            position: relative;
            overflow: hidden;
          }

          .module-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--iu-gold), var(--accent), transparent);
            opacity: 0;
            transition: opacity 0.25s ease;
          }

          .module-card:hover {
            transform: translateY(-4px);
            background: var(--card-hover);
            border-color: rgba(212, 175, 55, 0.35);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
          }

          .module-card:hover::before { opacity: 1; }

          .module-top-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .module-icon-box {
            width: 46px;
            height: 46px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.45rem;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
          }

          .module-badge {
            font-size: 0.72rem;
            font-weight: 700;
            padding: 0.25rem 0.7rem;
            border-radius: 9999px;
            letter-spacing: 0.04em;
          }

          .module-card-title {
            font-size: 1.2rem;
            font-weight: 700;
            color: #ffffff;
          }

          .module-card-desc {
            font-size: 0.9rem;
            color: var(--muted);
            line-height: 1.6;
            flex-grow: 1;
          }

          .module-link-foot {
            font-size: 0.84rem;
            font-weight: 600;
            color: var(--accent);
            display: inline-flex;
            align-items: center;
            gap: 4px;
            margin-top: 0.25rem;
          }

          /* 4. YBS ACADEMIC PILLARS (EDITORIAL NUMBERED STRIP) */
          .pillars-section {
            background: linear-gradient(180deg, rgba(15, 22, 38, 0.7) 0%, rgba(7, 10, 18, 1) 100%);
            border-top: 1px solid var(--border);
            border-bottom: 1px solid var(--border);
            padding: 4rem 2rem;
          }

          .pillars-container {
            max-width: 1320px;
            margin: 0 auto;
          }

          .pillars-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.35rem;
          }

          .pillar-card {
            background: rgba(255, 255, 255, 0.025);
            border: 1px solid rgba(255, 255, 255, 0.07);
            border-radius: 16px;
            padding: 1.65rem;
            transition: border-color 0.25s ease;
          }

          .pillar-card:hover {
            border-color: var(--border-gold);
          }

          .pillar-num {
            font-family: 'Cinzel', serif;
            font-size: 1.75rem;
            font-weight: 800;
            color: var(--iu-gold);
            opacity: 0.85;
            margin-bottom: 0.75rem;
            line-height: 1;
          }

          .pillar-card h4 {
            color: #ffffff;
            font-size: 1.05rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
          }

          .pillar-card p {
            color: var(--muted);
            font-size: 0.88rem;
            line-height: 1.6;
          }

          /* 5. API & ARCHITECTURE CALLOUT BANNER */
          .callout-section {
            max-width: 1320px;
            margin: 0 auto;
            padding: 3.5rem 2rem 1.5rem;
          }

          .callout-banner {
            background: linear-gradient(125deg, rgba(128, 0, 32, 0.32) 0%, rgba(15, 22, 38, 0.92) 55%, rgba(56, 189, 248, 0.14) 100%);
            border: 1px solid var(--border-gold);
            border-radius: 22px;
            padding: 2.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 2rem;
            flex-wrap: wrap;
          }

          .callout-banner h3 {
            font-family: 'Cinzel', serif;
            font-size: 1.55rem;
            color: #ffffff;
            margin-bottom: 0.45rem;
          }

          .callout-banner p {
            color: #cbd5e1;
            font-size: 0.95rem;
            max-width: 650px;
          }

          .callout-btns {
            display: flex;
            gap: 0.85rem;
            flex-wrap: wrap;
          }

          /* FOOTER */
          footer {
            background: #05070d;
            border-top: 1px solid var(--border);
            padding: 2.75rem 2rem;
            margin-top: 3rem;
            color: var(--muted);
          }

          .footer-container {
            max-width: 1320px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1.5rem;
          }

          .footer-links {
            display: flex;
            gap: 1.5rem;
            flex-wrap: wrap;
          }

          .footer-links a {
            color: var(--muted);
            text-decoration: none;
            font-size: 0.88rem;
            transition: color 0.2s;
          }

          .footer-links a:hover { color: var(--iu-gold); }

          .footer-bottom {
            max-width: 1320px;
            margin: 1.75rem auto 0;
            padding-top: 1.25rem;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            text-align: center;
            font-size: 0.8rem;
            color: #64748b;
          }

          /* RESPONSIVE BREAKPOINTS */
          @media (max-width: 1100px) {
            .hero-content { grid-template-columns: 1fr; gap: 2.5rem; }
            .bento-grid { grid-template-columns: 1fr; }
            .modules-grid { grid-template-columns: repeat(2, 1fr); }
            .pillars-grid { grid-template-columns: repeat(2, 1fr); }
          }

          @media (max-width: 680px) {
            .hero-section { padding: 3.5rem 1.25rem; min-height: auto; }
            .bento-section, .modules-section, .pillars-section, .callout-section { padding-left: 1.25rem; padding-right: 1.25rem; }
            .modules-grid, .pillars-grid, .dept-chips-grid { grid-template-columns: 1fr; }
            .job-feed-item { flex-direction: column; align-items: flex-start; }
            .callout-banner { padding: 1.75rem; }
          }
        </style>
      </head>
      <body>
        ${SharedHeader.renderHeader('home')}

        <!-- 1. CINEMATIC SPLIT HERO WITH SILENT FULL-BLEED VIDEO -->
        <section class="hero-section">
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
            <div class="hero-video-overlay"></div>
          </div>

          <div class="hero-content">
            <div class="hero-text">
              <div class="hero-badge">
                🏛️ T.C. İSTANBUL ÜNİVERSİTESİ • 1453 • İKTİSAT FAKÜLTESİ
              </div>
              <h1 class="hero-title">
                Yönetim Bilişim Sistemleri
                <span>Mezun & Kariyer Portalı</span>
              </h1>
              <div class="hero-subtitle">
                Teknoloji, Yönetim ve Verinin Kesiştiği Köklü Çatı
              </div>
              <p class="hero-desc">
                Türkiye'nin ilk üniversitesinde bilişim ve yönetim vizyonunu geleceğe taşıyoruz. Mezunlarımızı, öğrencilerimizi ve akademik kadromuzu tek bir modern kariyer ekosisteminde buluşturuyoruz.
              </p>

              <div class="hero-actions">
                <a href="/job-postings" class="cta-btn cta-primary">
                  💼 İlanları Keşfet (${totalJobs})
                </a>
                <a href="/users" class="cta-btn cta-glass">
                  👥 Mezun Ağı (${totalUsers})
                </a>
                <a href="/applications" class="cta-text-link">
                  📄 Başvurular (${totalApps}) →
                </a>
              </div>
            </div>

            <!-- FLOATING LIVE PULSE GLASS PANEL -->
            <aside class="hero-pulse-panel" aria-label="Canlı Portal Özeti">
              <div class="pulse-header">
                <div class="pulse-status">
                  <span class="live-dot"></span> CANLI PORTAL NABZI
                </div>
                <span class="pulse-tech-tag">PostgreSQL 16</span>
              </div>

              <div class="pulse-metrics-grid">
                <a href="/users" class="pulse-metric">
                  <div class="pulse-metric-val" style="color: #38bdf8;">${alumniCount}</div>
                  <div class="pulse-metric-lbl">Kayıtlı Mezun</div>
                </a>
                <a href="/users" class="pulse-metric">
                  <div class="pulse-metric-val" style="color: #c084fc;">${studentCount}</div>
                  <div class="pulse-metric-lbl">Aktif Öğrenci</div>
                </a>
                <a href="/job-postings" class="pulse-metric">
                  <div class="pulse-metric-val" style="color: #d4af37;">${activeJobsCount}</div>
                  <div class="pulse-metric-lbl">Açık İlan</div>
                </a>
                <a href="/departments" class="pulse-metric">
                  <div class="pulse-metric-val" style="color: #34d399;">${totalDepts}</div>
                  <div class="pulse-metric-lbl">Akademik Bölüm</div>
                </a>
              </div>

              ${heroSpotlightHtml}
            </aside>
          </div>
        </section>

        <!-- 2. LIVE BENTO SHOWCASE (RECENT JOBS + COMMUNITY + DEPARTMENTS) -->
        <section class="bento-section">
          <div class="section-top-bar">
            <div>
              <div class="section-eyebrow">GERÇEK ZAMANLI AKIŞ</div>
              <h2 class="section-title">Canlı Kariyer & Topluluk Ekosistemi</h2>
            </div>
            <a href="/job-postings" class="section-action-link">Tüm İlanları Gör (${totalJobs}) →</a>
          </div>

          <div class="bento-grid">
            <!-- LEFT: LIVE JOB POSTINGS FEED -->
            <div class="bento-card">
              <div class="bento-card-header">
                <h3 class="bento-card-title">💼 Son Açılan İş & Staj İlanları</h3>
                <span style="font-size: 0.8rem; color: var(--muted);">${activeJobsCount} aktif fırsat</span>
              </div>
              <div class="job-feed-list">
                ${recentJobsHtml}
              </div>
            </div>

            <!-- RIGHT STACK: COMMUNITY BREAKDOWN & DEPARTMENTS -->
            <div class="bento-stack">
              <div class="bento-card">
                <div class="bento-card-header">
                  <h3 class="bento-card-title">👥 Topluluk Dağılımı</h3>
                  <a href="/users" style="font-size: 0.82rem; color: var(--accent); text-decoration: none; font-weight: 600;">Yönet →</a>
                </div>
                <div class="role-bars">
                  <div class="role-bar-row">
                    <div class="role-bar-label">
                      <span>🎓 Mezunlar</span>
                      <span>${alumniCount} üye (%${alumniPct})</span>
                    </div>
                    <div class="role-track">
                      <div class="role-fill" style="width: ${alumniPct}%; background: linear-gradient(90deg, #d4af37, #f59e0b);"></div>
                    </div>
                  </div>
                  <div class="role-bar-row">
                    <div class="role-bar-label">
                      <span>📚 Öğrenciler</span>
                      <span>${studentCount} üye (%${studentPct})</span>
                    </div>
                    <div class="role-track">
                      <div class="role-fill" style="width: ${studentPct}%; background: linear-gradient(90deg, #38bdf8, #818cf8);"></div>
                    </div>
                  </div>
                  <div class="role-bar-row">
                    <div class="role-bar-label">
                      <span>👩‍🏫 Akademik Kadro & Yönetim</span>
                      <span>${academicCount} üye (%${academicPct})</span>
                    </div>
                    <div class="role-track">
                      <div class="role-fill" style="width: ${academicPct}%; background: linear-gradient(90deg, #10b981, #34d399);"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bento-card">
                <div class="bento-card-header">
                  <h3 class="bento-card-title">🏛️ Bölümler & Nested İlanlar</h3>
                  <a href="/departments" style="font-size: 0.82rem; color: var(--accent); text-decoration: none; font-weight: 600;">Tümü →</a>
                </div>
                <div class="dept-chips-grid">
                  ${deptChipsHtml}
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 3. PLATFORM MODULES BENTO GRID -->
        <section class="modules-section">
          <div class="section-top-bar">
            <div>
              <div class="section-eyebrow">MODÜLER YAPI</div>
              <h2 class="section-title">Sistem Modülleri & Hizmetler</h2>
            </div>
            <p class="section-desc">
              Tüm kariyer, başvuru, duyuru ve akademik ağ işlemlerine tek merkezden ulaşın.
            </p>
          </div>

          <div class="modules-grid">
            <a href="/job-postings" class="module-card">
              <div class="module-top-row">
                <div class="module-icon-box">💼</div>
                <span class="module-badge" style="background: rgba(56, 189, 248, 0.14); color: #38bdf8;">${totalJobs} İlan</span>
              </div>
              <h3 class="module-card-title">İş & Staj İlanları</h3>
              <p class="module-card-desc">
                Yazılım, veri analitiği, ürün yönetimi ve danışmanlık pozisyonlarını inceleyin veya yeni kariyer fırsatı yayınlayın.
              </p>
              <span class="module-link-foot">İlanları İncele →</span>
            </a>

            <a href="/applications" class="module-card">
              <div class="module-top-row">
                <div class="module-icon-box">📄</div>
                <span class="module-badge" style="background: rgba(16, 185, 129, 0.14); color: #34d399;">${totalApps} Başvuru</span>
              </div>
              <h3 class="module-card-title">Başvuru Takip Merkezi</h3>
              <p class="module-card-desc">
                Yapılan tüm başvuruları, CV bağlantılarını ve değerlendirme statülerini (Beklemede, İnceleniyor, Kabul, Ret) yönetin.
              </p>
              <span class="module-link-foot">Başvurulara Git →</span>
            </a>

            <a href="/departments" class="module-card">
              <div class="module-top-row">
                <div class="module-icon-box">🏛️</div>
                <span class="module-badge" style="background: rgba(168, 85, 247, 0.14); color: #c084fc;">${totalDepts} Bölüm</span>
              </div>
              <h3 class="module-card-title">Bölümler & Nested Rotalar</h3>
              <p class="module-card-desc">
                Fakülte bölümlerini ve bölümlere özel hedeflenmiş iş ilanlarını ilişkisel rotalar üzerinden keşfedin.
              </p>
              <span class="module-link-foot">Bölümleri Gör →</span>
            </a>

            <a href="/users" class="module-card">
              <div class="module-top-row">
                <div class="module-icon-box">👥</div>
                <span class="module-badge" style="background: rgba(99, 102, 241, 0.14); color: #a5b4fc;">${totalUsers} Üye</span>
              </div>
              <h3 class="module-card-title">Mezunlar & Kullanıcılar</h3>
              <p class="module-card-desc">
                Mezun, öğrenci ve akademisyen profillerini görüntüleyin, rol bazlı topluluğu yönetin ve yeni kayıt oluşturun.
              </p>
              <span class="module-link-foot">Topluluğu Gör →</span>
            </a>

            <a href="/announcements" class="module-card">
              <div class="module-top-row">
                <div class="module-icon-box">📢</div>
                <span class="module-badge" style="background: rgba(245, 158, 11, 0.14); color: #fbbf24;">Gündem</span>
              </div>
              <h3 class="module-card-title">Duyurular & Etkinlikler</h3>
              <p class="module-card-desc">
                Mezunlar buluşması, kariyer günleri, teknik seminerler ve bölüm duyurularını anlık olarak takip edin.
              </p>
              <span class="module-link-foot">Duyuruları Oku →</span>
            </a>

            <a href="/api/swagger" target="_blank" class="module-card">
              <div class="module-top-row">
                <div class="module-icon-box">⚡</div>
                <span class="module-badge" style="background: rgba(232, 96, 52, 0.16); color: #fb923c;">OpenAPI 3.0</span>
              </div>
              <h3 class="module-card-title">Swagger REST API</h3>
              <p class="module-card-desc">
                Tüm Direct ve Nested REST API endpoint'lerini canlı Swagger UI arayüzü üzerinden test edin ve şemaları inceleyin.
              </p>
              <span class="module-link-foot">API Portalını Aç →</span>
            </a>
          </div>
        </section>

        <!-- 4. YBS ACADEMIC PILLARS (EDITORIAL NUMBERED STRIP) -->
        <section class="pillars-section">
          <div class="pillars-container">
            <div class="section-top-bar">
              <div>
                <div class="section-eyebrow">AKADEMİK VİZYON</div>
                <h2 class="section-title">İÜ YBS Odak Disiplinleri</h2>
              </div>
              <p class="section-desc">
                İşletme yönetimi ile bilişim mühendisliğini birleştiren dört temel uzmanlık ekseni.
              </p>
            </div>

            <div class="pillars-grid">
              <div class="pillar-card">
                <div class="pillar-num">01</div>
                <h4>Veri Bilimi & İş Zekası</h4>
                <p>Büyük veri analitiği, veri madenciliği, karar destek sistemleri ve veri odaklı stratejik yönetim.</p>
              </div>
              <div class="pillar-card">
                <div class="pillar-num">02</div>
                <h4>Kurumsal Yazılım & Web</h4>
                <p>Full-Stack web mimarileri, bulut bilişim, mikroservisler, REST API tasarımı ve modern yazılım geliştirme.</p>
              </div>
              <div class="pillar-card">
                <div class="pillar-num">03</div>
                <h4>Siber Güvenlik & Yönetişim</h4>
                <p>Bilgi güvenliği, KVKK/GDPR uyumluluğu, BT risk yönetimi ve kurumsal sistem analizi.</p>
              </div>
              <div class="pillar-card">
                <div class="pillar-num">04</div>
                <h4>Yapay Zeka & İnovasyon</h4>
                <p>Makine öğrenmesi modelleri, süreç otomasyonu ve dijital iş modelleri dönüşümü.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- 5. DEVELOPER & ARCHITECTURE CALLOUT -->
        <section class="callout-section">
          <div class="callout-banner">
            <div>
              <h3>MVC Mimarisi & İnteraktif OpenAPI Altyapısı</h3>
              <p>
                Node.js, Express.js ve PostgreSQL 16 ile geliştirilen tam kapsamlı mezun takip sisteminin teknik mimarisini inceleyin veya REST uç noktalarını Swagger UI üzerinden deneyin.
              </p>
            </div>
            <div class="callout-btns">
              <a href="/api/swagger" target="_blank" class="cta-btn cta-primary">⚡ Swagger UI</a>
              <a href="/about" class="cta-btn cta-glass">ℹ️ Mimari Hakkında</a>
            </div>
          </div>
        </section>

        <!-- FOOTER -->
        <footer>
          <div class="footer-container">
            <div>
              <div style="font-family: 'Cinzel', serif; font-size: 1.1rem; color: #f8fafc; font-weight: 700;">
                İstanbul Üniversitesi İktisat Fakültesi
              </div>
              <div style="color: var(--iu-gold); font-size: 0.9rem; margin-top: 0.2rem;">
                Yönetim Bilişim Sistemleri Bölümü Mezun & Kariyer Bilgi Sistemi
              </div>
              <div style="font-size: 0.8rem; margin-top: 0.5rem; color: #64748b;">
                📍 Beyazıt Yerleşkesi, 34452 Fatih / İstanbul
              </div>
            </div>

            <div class="footer-links">
              <a href="/home">Ana Sayfa</a>
              <a href="/users">Mezunlar</a>
              <a href="/departments">Bölümler</a>
              <a href="/job-postings">İlanlar</a>
              <a href="/applications">Başvurular</a>
              <a href="/announcements">Duyurular</a>
              <a href="/about">Hakkında</a>
              <a href="/api/swagger" target="_blank">Swagger API</a>
            </div>
          </div>

          <div class="footer-bottom">
            © 2026 T.C. İstanbul Üniversitesi • Web Programlama Dersi MVC Mimarisi Projesi • Tüm Hakları Saklıdır.
          </div>
        </footer>

        <!-- PERFORMANCE OPTIMIZATIONS FOR HERO VIDEO (SILENT BACKGROUND) -->
        <script>
          (function() {
            const video = document.getElementById('heroGateVideo');
            if (!video) return;

            video.muted = true;
            video.volume = 0;

            if ('IntersectionObserver' in window) {
              const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                  if (entry.isIntersecting) {
                    if (video.paused) {
                      video.play().catch(() => {});
                    }
                  } else {
                    if (!video.paused) {
                      video.pause();
                    }
                  }
                });
              }, { threshold: 0.15 });

              observer.observe(video);
            }

            video.addEventListener('ended', function() {
              video.currentTime = 0;
              video.play().catch(() => {});
            });

            video.muted = true;
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {
                video.muted = true;
                video.play().catch(() => {});
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
        <title>Hakkında - İÜ YBS Mezun Takip Sistemi</title>
        <style>
          ${SharedHeader.getHeaderStyles()}

          body {
            font-family: 'Inter', system-ui, sans-serif;
            background: #070a12;
            color: #f8fafc;
            margin: 0;
            padding: 0;
            line-height: 1.6;
          }
          .container {
            max-width: 850px;
            margin: 3rem auto;
            padding: 0 1.5rem;
          }
          .box {
            background: #151d30;
            padding: 2.5rem;
            border-radius: 16px;
            border: 1px solid rgba(212, 175, 55, 0.3);
            box-shadow: 0 15px 35px rgba(0,0,0,0.5);
          }
          h1 {
            font-family: 'Cinzel', serif;
            color: #d4af37;
            font-size: 2rem;
            margin-top: 0;
          }
          p { color: #cbd5e1; }
          .btn {
            background: #38bdf8;
            color: #070a12;
            text-decoration: none;
            padding: 0.6rem 1.2rem;
            border-radius: 8px;
            font-weight: 700;
            display: inline-block;
            margin-top: 1.5rem;
          }
        </style>
      </head>
      <body>
        ${SharedHeader.renderHeader('about')}

        <div class="container">
          <div class="box">
            <h1>🏛️ İÜ YBS Mezun Takip Sistemi</h1>
            <p style="margin-top: 1rem;">
              Bu sistem, <strong>İstanbul Üniversitesi İktisat Fakültesi Yönetim Bilişim Sistemleri Bölümü</strong> bünyesinde geliştirilen; mezunlar, öğrenciler ve akademisyenler arasındaki bağı güçlendirmeyi amaçlayan kapsamlı bir web uygulamasıdır.
            </p>
            <p style="margin-top: 1rem;">
              <strong>Mimarî & Altyapı Özellikleri:</strong>
            </p>
            <ul style="color: #94a3b8; padding-left: 1.5rem; margin-top: 0.5rem; line-height: 1.8;">
              <li>Modern Node.js & Express.js MVC (Model-View-Controller) Katmanlı Mimarisi</li>
              <li>PostgreSQL 16 İlişkisel Veritabanı ve Docker Compose Konteyner Yapısı</li>
              <li>Direct Rotalar ve İlişkisel Nested Rotalar (Bölüm -> İlanlar, İlan -> Başvurular, Kullanıcı -> Başvurular)</li>
              <li>OpenAPI 3.0 & Swagger UI ile Tam REST API Dokümantasyonu</li>
              <li>Kariyer İlanı Yayınlama, CV ile Başvuru ve Anlık Canlı Arama/Filtreleme</li>
            </ul>
            <a href="/home" class="btn">🏠 Ana Sayfaya Dön</a>
          </div>
        </div>
      </body>
      </html>
    `;
  }
};

module.exports = HomeView;
