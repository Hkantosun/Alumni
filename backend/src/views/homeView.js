/**
 * HomeView - Istanbul University Management Information Systems (İÜ YBS)
 * Home Page & About Page View Layer
 */

const HomeView = {
  renderHomePage({ users = [], jobPostings = [], applications = [], departments = [] } = {}) {
    const totalUsers = users.length;
    const totalJobs = jobPostings.length;
    const totalApps = applications.length;
    const totalDepts = departments.length;

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>İstanbul Üniversitesi YBS - Mezun ve Kariyer Bilgi Sistemi</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap');
          
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
            overflow-x: hidden;
          }

          /* TOP STICKY NAVIGATION TABS */
          .top-header {
            position: sticky;
            top: 0;
            z-index: 1000;
            background: rgba(11, 15, 25, 0.92);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border-bottom: 1px solid rgba(212, 175, 55, 0.25);
            box-shadow: 0 4px 25px rgba(0, 0, 0, 0.5);
          }

          .header-container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0.85rem 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;
          }

          .brand {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            text-decoration: none;
            color: var(--text);
          }

          .brand-emblem {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: linear-gradient(135deg, #800020, #400010);
            border: 2px solid var(--iu-gold);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
            box-shadow: 0 0 15px var(--iu-gold-glow);
          }

          .brand-text {
            display: flex;
            flex-direction: column;
          }

          .brand-uni {
            font-family: 'Cinzel', serif;
            font-size: 0.95rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            color: #f1f5f9;
            text-transform: uppercase;
          }

          .brand-dept {
            font-size: 0.8rem;
            font-weight: 600;
            color: var(--iu-gold);
            letter-spacing: 0.03em;
          }

          .nav-tabs {
            display: flex;
            gap: 0.4rem;
            align-items: center;
            flex-wrap: wrap;
          }

          .nav-tab {
            color: var(--muted);
            text-decoration: none;
            padding: 0.55rem 0.9rem;
            border-radius: 8px;
            font-size: 0.88rem;
            font-weight: 500;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
          }

          .nav-tab:hover {
            color: var(--text);
            background: rgba(255, 255, 255, 0.05);
          }

          .nav-tab.active {
            color: #ffffff;
            background: linear-gradient(135deg, rgba(128, 0, 32, 0.6), rgba(56, 189, 248, 0.2));
            border: 1px solid var(--border-gold);
            font-weight: 600;
          }

          .nav-tab.api-tab {
            color: var(--accent);
            font-weight: 600;
            border: 1px solid rgba(56, 189, 248, 0.3);
          }

          .nav-tab.api-tab:hover {
            background: rgba(56, 189, 248, 0.15);
          }

          /* HERO SECTION WITH HISTORIC MAIN GATE BACKGROUND */
          .hero-section {
            position: relative;
            min-height: 520px;
            background: 
              linear-gradient(to right, rgba(7, 10, 18, 0.96) 0%, rgba(7, 10, 18, 0.82) 50%, rgba(7, 10, 18, 0.94) 100%),
              url('/images/iu_tarihi_kapi.jpg') center/cover no-repeat;
            display: flex;
            align-items: center;
            padding: 4rem 1.5rem;
            border-bottom: 1px solid var(--border);
          }

          .hero-content {
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 3rem;
            align-items: center;
          }

          @media (max-width: 968px) {
            .hero-content { grid-template-columns: 1fr; }
          }

          .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(212, 175, 55, 0.12);
            border: 1px solid var(--iu-gold);
            color: var(--iu-gold);
            padding: 0.4rem 0.9rem;
            border-radius: 9999px;
            font-size: 0.82rem;
            font-weight: 700;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            margin-bottom: 1.25rem;
            box-shadow: 0 0 20px var(--iu-gold-glow);
          }

          .hero-title {
            font-family: 'Cinzel', serif;
            font-size: 2.75rem;
            font-weight: 800;
            line-height: 1.2;
            color: #ffffff;
            margin-bottom: 0.75rem;
            text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
          }

          .hero-title span {
            background: linear-gradient(135deg, #d4af37 0%, #38bdf8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .hero-subtitle {
            font-size: 1.35rem;
            font-weight: 600;
            color: #e2e8f0;
            margin-bottom: 1rem;
          }

          .hero-desc {
            font-size: 1.05rem;
            color: var(--muted);
            line-height: 1.7;
            margin-bottom: 2rem;
            max-width: 620px;
          }

          .hero-actions {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
          }

          .cta-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.85rem 1.6rem;
            border-radius: 10px;
            font-weight: 700;
            font-size: 0.95rem;
            text-decoration: none;
            transition: all 0.25s ease;
            box-shadow: 0 8px 20px rgba(0,0,0,0.3);
          }

          .cta-btn:hover {
            transform: translateY(-2px);
          }

          .cta-primary {
            background: linear-gradient(135deg, #d4af37, #b8860b);
            color: #070a12;
            box-shadow: 0 8px 25px rgba(212, 175, 55, 0.35);
          }

          .cta-primary:hover {
            box-shadow: 0 10px 30px rgba(212, 175, 55, 0.5);
          }

          .cta-secondary {
            background: rgba(56, 189, 248, 0.15);
            color: #38bdf8;
            border: 1px solid rgba(56, 189, 248, 0.4);
          }

          .cta-secondary:hover {
            background: rgba(56, 189, 248, 0.25);
          }

          .hero-gate-card {
            background: rgba(21, 29, 48, 0.7);
            backdrop-filter: blur(12px);
            border: 1px solid var(--border-gold);
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
          }

          .gate-img-wrapper {
            position: relative;
            width: 100%;
            height: 240px;
            overflow: hidden;
          }

          .gate-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
          }

          .hero-gate-card:hover .gate-img {
            transform: scale(1.05);
          }

          .gate-caption {
            padding: 1.25rem;
          }

          .gate-title {
            font-family: 'Cinzel', serif;
            font-size: 1.1rem;
            color: var(--iu-gold);
            font-weight: 700;
            margin-bottom: 0.3rem;
          }

          .gate-info {
            font-size: 0.85rem;
            color: var(--muted);
            line-height: 1.5;
          }

          /* LIVE STATS STRIP */
          .stats-strip {
            background: var(--surface);
            border-bottom: 1px solid var(--border);
            padding: 2rem 1.5rem;
          }

          .stats-container {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1.5rem;
          }

          .stat-box {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1.25rem;
            transition: transform 0.2s ease, border-color 0.2s ease;
          }

          .stat-box:hover {
            transform: translateY(-3px);
            border-color: var(--border-gold);
          }

          .stat-icon {
            width: 52px;
            height: 52px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.6rem;
          }

          .stat-num {
            font-size: 2rem;
            font-weight: 800;
            color: var(--text);
            line-height: 1;
          }

          .stat-desc {
            font-size: 0.82rem;
            color: var(--muted);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-top: 0.3rem;
          }

          /* MAIN MODULES GRID */
          .main-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 3.5rem 1.5rem;
          }

          .section-header {
            text-align: center;
            margin-bottom: 2.5rem;
          }

          .section-title {
            font-size: 2rem;
            font-weight: 800;
            color: var(--text);
            margin-bottom: 0.5rem;
          }

          .section-desc {
            font-size: 1rem;
            color: var(--muted);
            max-width: 600px;
            margin: 0 auto;
          }

          .modules-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 1.5rem;
          }

          .module-card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 2rem;
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
            height: 3px;
            background: linear-gradient(90deg, transparent, var(--accent), transparent);
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .module-card:hover {
            transform: translateY(-5px);
            background: var(--card-hover);
            border-color: rgba(56, 189, 248, 0.4);
            box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.5);
          }

          .module-card:hover::before {
            opacity: 1;
          }

          .module-card-icon {
            font-size: 2.5rem;
            line-height: 1;
          }

          .module-card-title {
            font-size: 1.35rem;
            font-weight: 700;
            margin: 0;
            color: #f1f5f9;
          }

          .module-card-desc {
            font-size: 0.92rem;
            color: var(--muted);
            line-height: 1.6;
            margin: 0;
            flex-grow: 1;
          }

          .module-badge {
            align-self: flex-start;
            font-size: 0.75rem;
            font-weight: 700;
            padding: 0.25rem 0.65rem;
            border-radius: 20px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          /* YBS FOCUS PILLARS */
          .pillars-section {
            background: var(--surface);
            border-top: 1px solid var(--border);
            border-bottom: 1px solid var(--border);
            padding: 3.5rem 1.5rem;
          }

          .pillars-container {
            max-width: 1200px;
            margin: 0 auto;
          }

          .pillars-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.25rem;
            margin-top: 2rem;
          }

          .pillar-card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 1.5rem;
            border-left: 4px solid var(--iu-gold);
          }

          .pillar-card h4 {
            font-size: 1.05rem;
            color: var(--text);
            margin-bottom: 0.4rem;
          }

          .pillar-card p {
            font-size: 0.85rem;
            color: var(--muted);
            line-height: 1.5;
          }

          /* FOOTER */
          footer {
            background: #05080e;
            border-top: 1px solid var(--border);
            padding: 3rem 1.5rem 2rem;
            color: var(--muted);
          }

          .footer-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1.5rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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

          .footer-links a:hover {
            color: var(--iu-gold);
          }

          .footer-bottom {
            max-width: 1200px;
            margin: 1.5rem auto 0;
            text-align: center;
            font-size: 0.8rem;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <!-- TOP STICKY NAVIGATION BAR -->
        <header class="top-header">
          <div class="header-container">
            <a href="/home" class="brand">
              <div class="brand-emblem">🏛️</div>
              <div class="brand-text">
                <span class="brand-uni">İstanbul Üniversitesi</span>
                <span class="brand-dept">Yönetim Bilişim Sistemleri (YBS)</span>
              </div>
            </a>

            <nav class="nav-tabs">
              <a href="/home" class="nav-tab active">🏠 Ana Sayfa</a>
              <a href="/users" class="nav-tab">👥 Mezunlar & Kullanıcılar</a>
              <a href="/departments" class="nav-tab">🏛️ Bölümler</a>
              <a href="/job-postings" class="nav-tab">💼 İlanlar</a>
              <a href="/applications" class="nav-tab">📄 Başvurular</a>
              <a href="/announcements" class="nav-tab">📢 Duyurular</a>
              <a href="/about" class="nav-tab">ℹ️ Hakkında</a>
              <a href="/api/swagger" target="_blank" class="nav-tab api-tab">⚡ Swagger API</a>
            </nav>
          </div>
        </header>

        <!-- HERO SECTION WITH HISTORIC BEYAZIT GATE -->
        <section class="hero-section">
          <div class="hero-content">
            <div>
              <div class="hero-badge">
                🏛️ T.C. İSTANBUL ÜNİVERSİTESİ • 1453 • İKTİSAT FAKÜLTESİ
              </div>
              <h1 class="hero-title">
                Yönetim Bilişim Sistemleri <span>Mezun & Kariyer Portalı</span>
              </h1>
              <div class="hero-subtitle">
                Teknoloji, Yönetim ve Verinin Kesiştiği Köklü Çatı
              </div>
              <p class="hero-desc">
                Türkiye'nin ilk üniversitesinde bilişim ve yönetim vizyonunu geleceğe taşıyoruz. Mezunlarımızı, öğrencilerimizi ve akademik kadromuzu tek bir entegre platformda buluşturuyoruz.
              </p>

              <div class="hero-actions">
                <a href="/job-postings" class="cta-btn cta-primary">
                  💼 İlanları İncele (${totalJobs} Aktif İlan)
                </a>
                <a href="/applications" class="cta-btn cta-secondary">
                  📄 Başvuru Takibi (${totalApps} Başvuru)
                </a>
                <a href="/users" class="cta-btn" style="background: rgba(168, 85, 247, 0.2); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.4);">
                  👥 Mezun Ağı (${totalUsers} Üye)
                </a>
              </div>
            </div>

            <!-- HISTORIC GATE SHOWCASE CARD -->
            <div class="hero-gate-card">
              <div class="gate-img-wrapper">
                <img src="/images/iu_tarihi_kapi.jpg" alt="İstanbul Üniversitesi Beyazıt Tarihi Ana Kapı" class="gate-img">
              </div>
              <div class="gate-caption">
                <div class="gate-title">Tarihi Beyazıt Ana Kapısı</div>
                <p class="gate-info">
                  1453'ten bugüne bilimin, araştırmanın ve geleceği inşa eden liderlerin yetiştiği simge Beyazıt Yerleşkesi.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- LIVE STATISTICS STRIP -->
        <section class="stats-strip">
          <div class="stats-container">
            <div class="stat-box">
              <div class="stat-icon" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;">👥</div>
              <div>
                <div class="stat-num" style="color: #38bdf8;">${totalUsers}</div>
                <div class="stat-desc">Kayıtlı Kullanıcı & Mezun</div>
              </div>
            </div>

            <div class="stat-box">
              <div class="stat-icon" style="background: rgba(212, 175, 55, 0.15); color: #d4af37;">💼</div>
              <div>
                <div class="stat-num" style="color: #d4af37;">${totalJobs}</div>
                <div class="stat-desc">Açık İş & Staj İlanı</div>
              </div>
            </div>

            <div class="stat-box">
              <div class="stat-icon" style="background: rgba(16, 185, 129, 0.15); color: #34d399;">📄</div>
              <div>
                <div class="stat-num" style="color: #34d399;">${totalApps}</div>
                <div class="stat-desc">İş / Staj Başvurusu</div>
              </div>
            </div>

            <div class="stat-box">
              <div class="stat-icon" style="background: rgba(168, 85, 247, 0.15); color: #c084fc;">🏛️</div>
              <div>
                <div class="stat-num" style="color: #c084fc;">${totalDepts}</div>
                <div class="stat-desc">Akademik Bölüm</div>
              </div>
            </div>
          </div>
        </section>

        <!-- CORE MODULES GRID -->
        <main class="main-content">
          <div class="section-header">
            <h2 class="section-title">Sistem Modülleri & Hizmetler</h2>
            <p class="section-desc">
              İÜ YBS Mezun Takip Sistemi üzerinden tüm kariyer, başvuru ve akademik ağ fonksiyonlarına tek tıkla ulaşın.
            </p>
          </div>

          <div class="modules-grid">
            <!-- Module 1: Job Postings -->
            <a href="/job-postings" class="module-card">
              <span class="module-badge" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;">Kariyer Fırsatları</span>
              <div class="module-card-icon">💼</div>
              <h3 class="module-card-title">İş & Staj İlanları</h3>
              <p class="module-card-desc">
                YBS mezunları ve partner kurumlar tarafından paylaşılan yazılım, veri analitiği, danışmanlık ve yönetim pozisyonlarını inceleyin veya yeni ilan verin.
              </p>
            </a>

            <!-- Module 2: Applications -->
            <a href="/applications" class="module-card">
              <span class="module-badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399;">Başvuru Süreçleri</span>
              <div class="module-card-icon">📄</div>
              <h3 class="module-card-title">İş & Staj Başvuruları</h3>
              <p class="module-card-desc">
                İlanlara yapılan tüm başvuruları, aday CV bağlantılarını ve ön yazılarını görüntüleyin; başvuru durumlarını (Beklemede, İnceleniyor, Kabul, Ret) güncelleyin.
              </p>
            </a>

            <!-- Module 3: Departments & Nested Routes -->
            <a href="/departments" class="module-card">
              <span class="module-badge" style="background: rgba(168, 85, 247, 0.15); color: #c084fc;">Akademik Birimler</span>
              <div class="module-card-icon">🏛️</div>
              <h3 class="module-card-title">Bölümler & Nested İlanlar</h3>
              <p class="module-card-desc">
                İktisat Fakültesi bölümlerini ve her bölüme hedeflenmiş iş ilanlarını nested rotalar (/departments/:id/job-postings) üzerinden filtreleyerek keşfedin.
              </p>
            </a>

            <!-- Module 4: Users / Alumni -->
            <a href="/users" class="module-card">
              <span class="module-badge" style="background: rgba(99, 102, 241, 0.15); color: #a5b4fc;">Topluluk Ağı</span>
              <div class="module-card-icon">👥</div>
              <h3 class="module-card-title">Mezunlar & Kullanıcılar</h3>
              <p class="module-card-desc">
                Mezunlarımız, aktif öğrencilerimiz ve akademik kadromuzun profillerini görüntüleyin, arayın ve yeni kullanıcı kayıtları oluşturun.
              </p>
            </a>

            <!-- Module 5: Announcements -->
            <a href="/announcements" class="module-card">
              <span class="module-badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24;">Gündem & Etkinlik</span>
              <div class="module-card-icon">📢</div>
              <h3 class="module-card-title">Duyurular & Etkinlikler</h3>
              <p class="module-card-desc">
                Bölüm haberleri, mezunlar buluşması, hackathonlar, kariyer günleri ve akademik seminer takvimini anlık olarak takip edin.
              </p>
            </a>

            <!-- Module 6: Swagger API -->
            <a href="/api/swagger" target="_blank" class="module-card">
              <span class="module-badge" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;">OpenAPI 3.0</span>
              <div class="module-card-icon">⚡</div>
              <h3 class="module-card-title">Swagger API Dokümantasyonu</h3>
              <p class="module-card-desc">
                Geliştiriciler ve araştırmacılar için sistemin sunduğu tüm REST API ve nested endpoint'lerini interaktif Swagger UI üzerinden test edin.
              </p>
            </a>
          </div>
        </main>

        <!-- YBS ACADEMIC PILLARS -->
        <section class="pillars-section">
          <div class="pillars-container">
            <div class="section-header">
              <h2 class="section-title">İÜ Yönetim Bilişim Sistemleri Odak Alanları</h2>
              <p class="section-desc">
                Bölümümüz, çağımızın en kritik teknoloji ve yönetim disiplinlerinde lider mezunlar yetiştirmektedir.
              </p>
            </div>

            <div class="pillars-grid">
              <div class="pillar-card">
                <h4>📊 Veri Bilimi & İş Zekası</h4>
                <p>Büyük veri analitiği, veri madenciliği, iş zekası dashboardları ve veri odaklı stratejik karar alma mekanizmaları.</p>
              </div>
              <div class="pillar-card">
                <h4>💻 Kurumsal Yazılım & Web</h4>
                <p>Modern Full-Stack web mimarileri, bulut bilişim, mikroservisler, API tasarımı ve kurumsal yazılım geliştirme.</p>
              </div>
              <div class="pillar-card">
                <h4>🛡️ Siber Güvenlik & BT Yönetişimi</h4>
                <p>Bilgi güvenliği, KVKK/GDPR uyumluluğu, IT risk yönetimi, sistem analizi ve kurumsal bilişim standartları.</p>
              </div>
              <div class="pillar-card">
                <h4>🤖 Yapay Zeka & İnovasyon</h4>
                <p>Makine öğrenmesi modelleri, doğal dil işleme, süreç otomasyonu ve dijital iş modelleri dönüşümü.</p>
              </div>
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
              <a href="/users">Kullanıcılar</a>
              <a href="/departments">Bölümler</a>
              <a href="/job-postings">İş İlanları</a>
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
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');
          body {
            font-family: 'Inter', system-ui, sans-serif;
            background: #070a12;
            color: #f8fafc;
            padding: 3rem 1.5rem;
            margin: 0;
            line-height: 1.6;
          }
          .box {
            max-width: 750px;
            margin: 2rem auto;
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
      </body>
      </html>
    `;
  }
};

module.exports = HomeView;
