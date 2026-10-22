/**
 * UserController - Web Page Controller for User resources
 * Full CRUD Operations integrated with PostgreSQL database and View Layer (UserViews):
 *   1. READ ALL   (GET /users)            -> renderUserList
 *   2. READ ONE   (GET /users/:id)        -> renderUserDetail
 *   3. EDIT FORM  (GET /users/:id/edit)   -> renderEditForm
 *   4. CREATE     (POST /users)           -> createUser
 *   5. UPDATE     (POST /users/:id/update -> updateUser
 *                  & PUT /users/:id)
 *   6. DELETE     (POST /users/:id/delete -> deleteUser
 *                  & DELETE /users/:id)
 */

const UserModel = require('../models/userModel');
const UserViews = require('../views/userViews');

const UserController = {
  /**
   * 1. READ ALL (GET /users)
   */
  async renderUserList(req, res) {
    try {
      const { sortBy = 'id', order = 'asc' } = req.query;
      const users = await UserModel.getAll({ sortBy, order });
      const htmlView = UserViews.renderUserListPage(users);
      res.send(htmlView);
    } catch (err) {
      console.error('Error in renderUserList:', err);
      res.status(500).send('<h2>Veritabanı hatası: Kullanıcı listesi alınamadı.</h2>');
    }
  },

  /**
   * 2. READ ONE (GET /users/:id)
   */
  async renderUserDetail(req, res) {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await UserModel.getById(userId);

      if (!user) {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html lang="tr">
          <head><title>Kullanıcı Bulunamadı</title></head>
          <body style="font-family: sans-serif; background: #0f172a; color: #ef4444; text-align: center; padding: 50px;">
            <h1>404 - Kullanıcı Bulunamadı</h1>
            <p>ID'si ${userId} olan kullanıcı sistemde mevcut değil.</p>
            <a href="/users" style="color: #6366f1;">Listeye Dön</a>
          </body>
          </html>
        `);
      }

      const htmlView = UserViews.renderUserDetailPage(user);
      res.send(htmlView);
    } catch (err) {
      console.error('Error in renderUserDetail:', err);
      res.status(500).send('<h2>Veritabanı hatası: Kullanıcı detayı alınamadı.</h2>');
    }
  },

  /**
   * 3. EDIT FORM (GET /users/:id/edit)
   */
  async renderEditForm(req, res) {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await UserModel.getById(userId);

      if (!user) {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html lang="tr">
          <body style="font-family: sans-serif; background: #0f172a; color: #ef4444; text-align: center; padding: 50px;">
            <h1>404 - Düzenlenecek Kullanıcı Bulunamadı</h1>
            <a href="/users" style="color: #6366f1;">Listeye Dön</a>
          </body>
          </html>
        `);
      }

      const htmlView = UserViews.renderUserEditPage(user);
      res.send(htmlView);
    } catch (err) {
      console.error('Error in renderEditForm:', err);
      res.status(500).send('<h2>Veritabanı hatası: Düzenleme formu yüklenemedi.</h2>');
    }
  },

  /**
   * 4. CREATE (POST /users)
   */
  async createUser(req, res) {
    try {
      const payload = req.body;

      if (!payload || !payload.name || Object.keys(payload).length === 0) {
        return res.status(400).send(`
          <!DOCTYPE html>
          <html lang="tr">
          <body style="font-family: sans-serif; background: #0f172a; color: #ef4444; padding: 3rem; text-align: center;">
            <h2>Hata: Boş veya Geçersiz Veri</h2>
            <p>Lütfen isim ve e-posta alanlarını doldurarak tekrar deneyiniz.</p>
            <a href="/users" style="color: #6366f1;">Forma Dön</a>
          </body>
          </html>
        `);
      }

      const newUser = await UserModel.create(payload);
      const htmlView = UserViews.renderUserCreatedPage(newUser);
      res.send(htmlView);
    } catch (err) {
      console.error('Error in createUser:', err);
      res.status(500).send('<h2>Veritabanı hatası: Kullanıcı kaydedilemedi: ' + err.message + '</h2>');
    }
  },

  /**
   * 5. UPDATE (POST /users/:id/update & PUT /users/:id)
   */
  async updateUser(req, res) {
    try {
      const userId = parseInt(req.params.id, 10);
      const payload = req.body;

      const updatedUser = await UserModel.update(userId, payload);

      if (!updatedUser) {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html lang="tr">
          <body style="font-family: sans-serif; background: #0f172a; color: #ef4444; padding: 3rem; text-align: center;">
            <h2>Hata: 404 - Güncellenecek Kullanıcı Bulunamadı</h2>
            <a href="/users" style="color: #6366f1;">Listeye Dön</a>
          </body>
          </html>
        `);
      }

      const htmlView = UserViews.renderUserUpdatedPage(updatedUser);
      res.send(htmlView);
    } catch (err) {
      console.error('Error in updateUser:', err);
      res.status(500).send('<h2>Veritabanı hatası: Kullanıcı güncellenemedi: ' + err.message + '</h2>');
    }
  },

  /**
   * 6. DELETE (POST /users/:id/delete & DELETE /users/:id)
   */
  async deleteUser(req, res) {
    try {
      const userId = parseInt(req.params.id, 10);
      const deletedUser = await UserModel.delete(userId);

      if (!deletedUser) {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html lang="tr">
          <body style="font-family: sans-serif; background: #0f172a; color: #ef4444; padding: 3rem; text-align: center;">
            <h2>Hata: 404 - Silinecek Kullanıcı Bulunamadı</h2>
            <a href="/users" style="color: #6366f1;">Listeye Dön</a>
          </body>
          </html>
        `);
      }

      const htmlView = UserViews.renderUserDeletedPage(deletedUser);
      res.send(htmlView);
    } catch (err) {
      console.error('Error in deleteUser:', err);
      res.status(500).send('<h2>Veritabanı hatası: Kullanıcı silinemedi: ' + err.message + '</h2>');
    }
  },

  renderHome(req, res) {
    return UserController.renderHomePage(req, res);
  },

  renderAbout(req, res) {
    return UserController.renderAboutPage(req, res);
  },

  renderHomePage(req, res) {
    res.send(`
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Alumni Tracking System - Ana Sayfa</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          :root {
            --bg: #0b0f19;
            --surface: #111827;
            --card-bg: #1e293b;
            --card-hover: #243247;
            --accent: #38bdf8;
            --purple: #a855f7;
            --emerald: #10b981;
            --amber: #f59e0b;
            --text: #f8fafc;
            --muted: #94a3b8;
            --border: #334155;
          }
          * { box-sizing: border-box; }
          body {
            font-family: 'Inter', system-ui, sans-serif;
            background: var(--bg);
            color: var(--text);
            margin: 0;
            padding: 2.5rem 1rem;
          }
          .container { max-width: 1050px; margin: 0 auto; }
          .hero {
            background: linear-gradient(180deg, #1e293b 0%, #111827 100%);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 3rem 2rem;
            text-align: center;
            box-shadow: 0 20px 40px -15px rgba(0,0,0,0.5);
            margin-bottom: 2.5rem;
          }
          h1 {
            font-size: 2.6rem;
            margin: 0 0 1rem 0;
            background: linear-gradient(135deg, #38bdf8, #818cf8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 800;
          }
          p.lead {
            font-size: 1.15rem;
            color: var(--muted);
            max-width: 650px;
            margin: 0 auto 1.5rem auto;
            line-height: 1.6;
          }
          .modules-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.25rem;
          }
          .module-card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 1.75rem;
            text-decoration: none;
            color: var(--text);
            display: flex;
            flex-direction: column;
            gap: 0.6rem;
            transition: all 0.25s ease;
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
          }
          .module-card:hover {
            transform: translateY(-4px);
            background: var(--card-hover);
            border-color: var(--accent);
          }
          .module-icon { font-size: 2.2rem; }
          .module-title { font-size: 1.25rem; font-weight: 700; margin: 0; }
          .module-desc { font-size: 0.9rem; color: var(--muted); line-height: 1.5; margin: 0; }
          .module-badge {
            align-self: flex-start;
            font-size: 0.75rem;
            font-weight: 700;
            padding: 0.2rem 0.6rem;
            border-radius: 20px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="hero">
            <h1>🎓 Alumni Tracking System</h1>
            <p class="lead">
              Mezunlar, öğrenciler ve akademik personeli birbirine bağlayan, kariyer ve başvuru takibi sağlayan tam kapsamlı web platformu.
            </p>
          </div>

          <div class="modules-grid">
            <a href="/job-postings" class="module-card">
              <span class="module-icon">💼</span>
              <span class="module-badge" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8;">Kariyer & İlanlar</span>
              <h3 class="module-title">İş & Staj İlanları</h3>
              <p class="module-desc">Mezun ve kurumların paylaştığı iş/staj ilanlarını listeleyin, bölümlere göre filtreleyin ve yeni pozisyon açın.</p>
            </a>

            <a href="/applications" class="module-card">
              <span class="module-icon">📄</span>
              <span class="module-badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">Başvuru Yönetimi</span>
              <h3 class="module-title">İş & Staj Başvuruları</h3>
              <p class="module-desc">İlanlara yapılan tüm başvuruları inceleyin, başvuru durumlarını (kabul, inceleme, ret) güncelleyin ve CV'leri görüntüleyin.</p>
            </a>

            <a href="/departments" class="module-card">
              <span class="module-icon">🏛️</span>
              <span class="module-badge" style="background: rgba(168, 85, 247, 0.2); color: #c084fc;">Akademik Birimler</span>
              <h3 class="module-title">Bölümler (Nested Rotalar)</h3>
              <p class="module-desc">Üniversite bölümlerini ve bölümlere bağlı ilanları nested rotalar (/departments/:id/job-postings) üzerinden inceleyin.</p>
            </a>

            <a href="/users" class="module-card">
              <span class="module-icon">👥</span>
              <span class="module-badge" style="background: rgba(99, 102, 241, 0.2); color: #a5b4fc;">Kullanıcı Yönetimi</span>
              <h3 class="module-title">Mezunlar & Kullanıcılar</h3>
              <p class="module-desc">Mezun, öğrenci ve akademik personel profillerini listeleyin, filtreleyin ve yeni kayıtlar oluşturun.</p>
            </a>

            <a href="/announcements" class="module-card">
              <span class="module-icon">📢</span>
              <span class="module-badge" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24;">Haber & Duyuru</span>
              <h3 class="module-title">Duyurular & Etkinlikler</h3>
              <p class="module-desc">Mezunlar ve öğrenciler için duyuru, kariyer günleri ve etkinlik haberlerini yönetin.</p>
            </a>

            <a href="/api/swagger" target="_blank" class="module-card">
              <span class="module-icon">⚡</span>
              <span class="module-badge" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8;">OpenAPI 3.0</span>
              <h3 class="module-title">Swagger API Dokümantasyonu</h3>
              <p class="module-desc">Tüm REST API ve Nested endpoint'lerini interaktif Swagger UI konsolu üzerinden test edin ve keşfedin.</p>
            </a>
          </div>
        </div>
      </body>
      </html>
    `);
  },

  renderAboutPage(req, res) {
    res.send(`
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>Hakkında - Alumni Tracking System</title>
        <style>
          body { font-family: 'Inter', system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 3rem; margin: 0; }
          .box { max-width: 600px; margin: 2rem auto; background: #1e293b; padding: 2rem; border-radius: 12px; border: 1px solid #334155; }
          h1 { color: #818cf8; }
          a { color: #6366f1; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>ℹ️ Proje Hakkında</h1>
          <p>Bu sistem Web Programlama dersi kapsamında geliştirilmektedir. MVC mimarisi ve PostgreSQL 16 veritabanı ile tam CRUD özelliklerine sahiptir.</p>
          <p><a href="/users">← Kullanıcı Listesine Dön</a> | <a href="/home">Ana Sayfa</a></p>
        </div>
      </body>
      </html>
    `);
  }
};

module.exports = UserController;
