/**
 * NotFoundView - Generic 404 View Layer
 * Renders an aesthetically rich, unified 404 Error Page for invalid web requests.
 */

const NotFoundView = {
  renderNotFoundPage({ requestedUrl = '', reason = '', method = 'GET' } = {}) {
    const displayUrl = requestedUrl || 'Bilinmeyen Sayfa';
    const displayReason = reason || 'Ulaşmaya çalıştığınız sayfa veya kaynak sistemde bulunamadı ya da kaldırılmış olabilir.';

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 Sayfa Bulunamadı - Mezun ve Kariyer Bilgi Sistemi</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
          
          :root {
            --bg: #070a12;
            --surface: #0f1626;
            --card-bg: #151d30;
            --card-hover: #1e2942;
            --iu-burgundy: #800020;
            --iu-gold: #d4af37;
            --iu-gold-glow: rgba(212, 175, 55, 0.25);
            --accent: #38bdf8;
            --accent-hover: #0284c7;
            --purple: #a855f7;
            --emerald: #10b981;
            --amber: #f59e0b;
            --text: #f8fafc;
            --muted: #94a3b8;
            --border: #1e293b;
            --border-gold: rgba(212, 175, 55, 0.35);
          }

          * { box-sizing: border-box; margin: 0; padding: 0; }

          body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: var(--bg);
            color: var(--text);
            line-height: 1.6;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }

          /* TOP MINIMALIST HEADER */
          .top-header {
            position: sticky;
            top: 0;
            z-index: 1000;
            height: 72px;
            background: rgba(7, 10, 18, 0.82);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            transition: all 0.25s ease;
          }

          .header-container {
            max-width: 1360px;
            height: 100%;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1.5rem;
          }

          .brand {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            text-decoration: none;
            color: #ffffff;
            flex-shrink: 0;
            transition: opacity 0.2s ease;
          }

          .brand:hover {
            opacity: 0.9;
          }

          .brand-badge {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            background: linear-gradient(135deg, rgba(128, 0, 32, 0.95), rgba(212, 175, 55, 0.35));
            border: 1px solid rgba(212, 175, 55, 0.45);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Cinzel', serif;
            font-weight: 800;
            font-size: 0.95rem;
            color: #ffffff;
            letter-spacing: 0.04em;
            box-shadow: 0 0 15px rgba(212, 175, 55, 0.25);
          }

          .brand-text {
            display: flex;
            flex-direction: column;
            line-height: 1.25;
          }

          .brand-name {
            font-family: 'Cinzel', serif;
            font-size: 1rem;
            font-weight: 700;
            letter-spacing: 0.03em;
            color: #ffffff;
            display: flex;
            align-items: center;
            gap: 3px;
          }

          .brand-sparkle {
            color: var(--iu-gold);
            font-size: 0.75rem;
            display: inline-block;
            transform: translateY(-2px);
          }

          .brand-tag {
            font-size: 0.74rem;
            font-weight: 500;
            color: var(--muted);
            letter-spacing: 0.02em;
          }

          .nav-links {
            display: flex;
            align-items: center;
            gap: 2rem;
          }

          .nav-link {
            color: #94a3b8;
            text-decoration: none;
            font-size: 0.92rem;
            font-weight: 500;
            letter-spacing: 0.01em;
            padding: 0.4rem 0;
            position: relative;
            transition: color 0.2s ease;
            white-space: nowrap;
          }

          .nav-link:hover {
            color: #ffffff;
          }

          .nav-link.active {
            color: #ffffff;
            font-weight: 600;
          }

          .header-actions {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            flex-shrink: 0;
          }

          .header-cta-pill {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.4rem;
            padding: 0.55rem 1.45rem;
            border-radius: 9999px;
            background: linear-gradient(135deg, #e86034 0%, #d44e24 100%);
            color: #ffffff;
            font-size: 0.88rem;
            font-weight: 600;
            text-decoration: none;
            letter-spacing: 0.02em;
            box-shadow: 0 4px 16px rgba(232, 96, 52, 0.35);
            transition: all 0.25s ease;
          }

          .header-cta-pill:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 22px rgba(232, 96, 52, 0.55);
            filter: brightness(1.08);
          }

          @media (max-width: 868px) {
            .top-header {
              height: auto;
              padding: 0.75rem 0;
            }
            .header-container {
              padding: 0 1rem;
              flex-wrap: wrap;
              gap: 0.75rem;
            }
            .nav-links {
              order: 3;
              width: 100%;
              overflow-x: auto;
              padding-bottom: 0.35rem;
              gap: 1.25rem;
              -webkit-overflow-scrolling: touch;
              scrollbar-width: none;
            }
            .nav-links::-webkit-scrollbar {
              display: none;
            }
            .brand-tag {
              display: none;
            }
            .header-cta-pill {
              padding: 0.45rem 1rem;
              font-size: 0.82rem;
            }
          }

          /* MAIN CONTENT AREA */
          .main-content {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 3rem 1.5rem;
          }

          .not-found-card {
            background: radial-gradient(circle at top, #151d30 0%, #0d1322 100%);
            border: 1px solid var(--border-gold);
            border-radius: 20px;
            max-width: 680px;
            width: 100%;
            padding: 3rem 2.5rem;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(212, 175, 55, 0.1);
            text-align: center;
            position: relative;
            overflow: hidden;
          }

          .not-found-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--iu-burgundy), var(--iu-gold), var(--accent));
          }

          .badge-guardian {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.4rem 1rem;
            border-radius: 9999px;
            background: rgba(239, 68, 68, 0.15);
            color: #f87171;
            border: 1px solid rgba(239, 68, 68, 0.3);
            font-size: 0.82rem;
            font-weight: 600;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            margin-bottom: 1.5rem;
          }

          .big-code {
            font-family: 'Cinzel', serif;
            font-size: 6.5rem;
            font-weight: 800;
            line-height: 1;
            background: linear-gradient(135deg, #f87171 0%, var(--iu-gold) 60%, var(--accent) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1rem;
            text-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          }

          .title {
            font-size: 1.6rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 1rem;
          }

          .reason-panel {
            background: #0a0f1d;
            border: 1px solid var(--border);
            border-left: 4px solid var(--iu-gold);
            border-radius: 10px;
            padding: 1.25rem;
            text-align: left;
            margin: 1.8rem 0;
          }

          .reason-header {
            font-size: 0.78rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--iu-gold);
            margin-bottom: 0.4rem;
          }

          .reason-text {
            font-size: 0.92rem;
            color: #e2e8f0;
            line-height: 1.55;
          }

          .requested-pill {
            display: inline-block;
            font-family: 'JetBrains Mono', monospace;
            background: rgba(56, 189, 248, 0.1);
            color: var(--accent);
            border: 1px solid rgba(56, 189, 248, 0.25);
            padding: 0.35rem 0.75rem;
            border-radius: 6px;
            font-size: 0.85rem;
            margin-top: 0.65rem;
            word-break: break-all;
          }

          .actions {
            display: flex;
            gap: 0.85rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 2rem;
          }

          .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.4rem;
            border-radius: 10px;
            font-size: 0.92rem;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.25s ease;
          }

          .btn-primary {
            background: linear-gradient(135deg, var(--iu-gold), #b89025);
            color: #070a12;
            box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
          }

          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(212, 175, 55, 0.45);
          }

          .btn-secondary {
            background: #1a2236;
            color: #cbd5e1;
            border: 1px solid var(--border);
          }

          .btn-secondary:hover {
            background: #232f48;
            color: #ffffff;
            border-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
          }

          /* FOOTER */
          .page-footer {
            border-top: 1px solid var(--border);
            padding: 1.25rem 1.5rem;
            text-align: center;
            font-size: 0.82rem;
            color: var(--muted);
            background: rgba(11, 15, 25, 0.7);
          }
        </style>
      </head>
      <body>
        <!-- HEADER -->
        <header class="top-header">
          <div class="header-container">
            <a href="/home" class="brand" aria-label="İstanbul Üniversitesi YBS Ana Sayfa">
              <div class="brand-badge">İÜ</div>
              <div class="brand-text">
                <span class="brand-name">İstanbul Üniversitesi<span class="brand-sparkle">✦</span></span>
                <span class="brand-tag">YBS Mezun & Kariyer Portalı</span>
              </div>
            </a>
            <nav class="nav-links">
              <a href="/home" class="nav-link">Ana Sayfa</a>
              <a href="/users" class="nav-link">Mezunlar</a>
              <a href="/departments" class="nav-link">Bölümler</a>
              <a href="/job-postings" class="nav-link">İlanlar</a>
              <a href="/applications" class="nav-link">Başvurular</a>
              <a href="/announcements" class="nav-link">Duyurular</a>
              <a href="/about" class="nav-link">Hakkında</a>
            </nav>
            <div class="header-actions">
              <a href="/api/swagger" target="_blank" class="header-cta-pill" title="Swagger OpenAPI Arayüzü">
                Swagger API
              </a>
            </div>
          </div>
        </header>

        <!-- MAIN -->
        <main class="main-content">
          <div class="not-found-card">
            <div class="badge-guardian">🛡️ 404 Guardian & Generic 404 Page</div>
            <div class="big-code">404</div>
            <h1 class="title">Aradığınız Sayfa Bulunamadı</h1>
            <p style="color: var(--muted); font-size: 0.95rem;">
              İstediğiniz adres sistemimizde kayıtlı bir sayfaya veya kaynağa işaret etmiyor.
            </p>

            <div class="reason-panel">
              <div class="reason-header">Geçersiz İstek / Hata Sebebi</div>
              <div class="reason-text">${displayReason}</div>
              <div class="requested-pill">${method} ${displayUrl}</div>
            </div>

            <div class="actions">
              <a href="/home" class="btn btn-primary">🏠 Ana Sayfaya Dön</a>
              <a href="/job-postings" class="btn btn-secondary">💼 İş İlanlarını İncele</a>
              <a href="/api/swagger" class="btn btn-secondary">📚 API Dokümantasyonu</a>
            </div>
          </div>
        </main>

        <!-- FOOTER -->
        <footer class="page-footer">
          İstanbul Üniversitesi Yönetim Bilişim Sistemleri (YBS) • 404 Guardian Middleware
        </footer>
      </body>
      </html>
    `;
  }
};

module.exports = NotFoundView;

