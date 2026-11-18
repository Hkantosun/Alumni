/**
 * SharedHeader Component - Istanbul University Management Information Systems (İÜ YBS)
 * Minimalist, Modern Top Sticky Navigation Header
 */

const SharedHeader = {
  getHeaderStyles() {
    return `
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

      /* TOP MINIMALIST HEADER (CLEAN & ELEGANT) */
      .top-header {
        position: sticky;
        top: 0;
        z-index: 1000;
        height: 72px;
        background: rgba(7, 10, 18, 0.88);
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
        color: #d4af37;
        font-size: 0.75rem;
        display: inline-block;
        transform: translateY(-2px);
      }

      .brand-tag {
        font-size: 0.74rem;
        font-weight: 500;
        color: #94a3b8;
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

      .nav-link.active::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #d4af37, #e86034);
        border-radius: 2px;
        box-shadow: 0 0 8px rgba(232, 96, 52, 0.4);
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

      @media (max-width: 1080px) {
        .nav-links {
          gap: 1.25rem;
        }
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
    `;
  },

  renderHeader(activeTab = 'home') {
    return `
      <!-- TOP MINIMALIST HEADER BAR -->
      <header class="top-header">
        <div class="header-container">
          <!-- BRAND LOGO -->
          <a href="/home" class="brand" aria-label="İstanbul Üniversitesi YBS Ana Sayfa">
            <div class="brand-badge">İÜ</div>
            <div class="brand-text">
              <span class="brand-name">İstanbul Üniversitesi<span class="brand-sparkle">✦</span></span>
              <span class="brand-tag">YBS Mezun & Kariyer Portalı</span>
            </div>
          </a>

          <!-- CENTER MINIMALIST NAV LINKS -->
          <nav class="nav-links">
            <a href="/home" class="nav-link ${activeTab === 'home' ? 'active' : ''}">Ana Sayfa</a>
            <a href="/users" class="nav-link ${activeTab === 'users' ? 'active' : ''}">Mezunlar</a>
            <a href="/departments" class="nav-link ${activeTab === 'departments' ? 'active' : ''}">Bölümler</a>
            <a href="/job-postings" class="nav-link ${activeTab === 'job-postings' ? 'active' : ''}">İlanlar</a>
            <a href="/applications" class="nav-link ${activeTab === 'applications' ? 'active' : ''}">Başvurular</a>
            <a href="/announcements" class="nav-link ${activeTab === 'announcements' ? 'active' : ''}">Duyurular</a>
            <a href="/about" class="nav-link ${activeTab === 'about' ? 'active' : ''}">Hakkında</a>
          </nav>

          <!-- RIGHT STANDOUT PILL CTA BUTTON -->
          <div class="header-actions">
            <a href="/api/swagger" target="_blank" class="header-cta-pill" title="Swagger OpenAPI Arayüzü">
              Swagger API
            </a>
          </div>
        </div>
      </header>
    `;
  }
};

module.exports = SharedHeader;

