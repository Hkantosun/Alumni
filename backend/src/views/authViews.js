/**
 * AuthViews - HTML Templates for User Registration
 * Styled consistently with DESIGN.md (Mintlify Design System) via MintlifyTheme.
 */

const MintlifyTheme = require('./mintlifyTheme');
const { escapeHtml } = MintlifyTheme;

const ROLE_LABELS = {
  alumni: 'Mezun (Alumni)',
  student: 'Öğrenci (Student)',
  academic_staff: 'Akademik Personel'
};

const AuthViews = {
  /**
   * Render the Registration Page (GET /register)
   */
  renderRegisterPage({ departments = [], formData = {}, error = null } = {}) {
    const selectedRole = ['alumni', 'student', 'academic_staff'].includes(formData.role)
      ? formData.role
      : 'alumni';

    const departmentOptions = departments.map(dept => {
      const selected = String(formData.department_id || '') === String(dept.id) ? 'selected' : '';
      return `<option value="${dept.id}" ${selected}>${escapeHtml(dept.code)} — ${escapeHtml(dept.name)}</option>`;
    }).join('');

    const errorBanner = error
      ? `
        <div class="alert-error" role="alert">
          <strong>Kayıt Tamamlanamadı:</strong> ${escapeHtml(error)}
        </div>
      `
      : '';

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kayıt Ol — İÜ YBS Mezun & Kariyer Portalı</title>
        <style>
          ${MintlifyTheme.getBaseStyles()}

          .register-shell {
            max-width: 780px;
            margin: 40px auto 72px;
            padding: 0 24px;
          }

          .register-header {
            margin-bottom: 24px;
          }

          .register-card {
            background-color: var(--canvas);
            border: 1px solid var(--hairline);
            border-radius: var(--rounded-xl);
            padding: 32px;
          }

          .section-divider {
            border: none;
            border-top: 1px solid var(--hairline-soft);
            margin: 24px 0;
          }

          .section-label {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--steel);
            margin-bottom: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .role-selector-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 8px;
          }

          .role-card {
            position: relative;
            border: 1px solid var(--hairline);
            border-radius: var(--rounded-lg);
            padding: 14px 16px;
            cursor: pointer;
            background-color: var(--surface-soft);
            transition: border-color 0.15s ease, background-color 0.15s ease;
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .role-card:hover {
            border-color: var(--stone);
          }

          .role-card.active {
            border: 2px solid var(--brand-green);
            background-color: var(--canvas);
          }

          .role-card input[type="radio"] {
            position: absolute;
            opacity: 0;
            pointer-events: none;
          }

          .role-card-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--ink);
          }

          .role-card-desc {
            font-size: 12px;
            color: var(--steel);
            line-height: 1.4;
          }

          .role-section {
            display: none;
          }

          .role-section.active {
            display: block;
          }

          .checkbox-row {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 14px;
            border: 1px solid var(--hairline);
            border-radius: var(--rounded-md);
            background-color: var(--surface-soft);
            cursor: pointer;
            font-size: 14px;
            color: var(--charcoal);
          }

          .checkbox-row input[type="checkbox"] {
            width: 16px;
            height: 16px;
            accent-color: var(--brand-green-deep);
            cursor: pointer;
          }

          .alert-error {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            color: #991b1b;
            padding: 12px 16px;
            border-radius: var(--rounded-md);
            font-size: 14px;
            margin-bottom: 20px;
          }

          .form-actions {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-top: 24px;
            flex-wrap: wrap;
          }

          .field-hint {
            font-size: 12px;
            color: var(--stone);
          }

          @media (max-width: 768px) {
            .register-card { padding: 22px 18px; }
            .role-selector-grid { grid-template-columns: 1fr; }
          }
        </style>
      </head>
      <body>
        ${MintlifyTheme.renderHeader('register')}

        <main class="page-main">
          <div class="register-shell">
            <div class="register-header">
              <span class="section-kicker"><span class="mint-dot"></span> HESAP OLUŞTURMA</span>
              <h1 class="page-title">Portala Kayıt Ol</h1>
              <p class="page-subtitle">Mezun, aktif öğrenci veya akademik personel olarak İstanbul Üniversitesi YBS ağına katılın.</p>
            </div>

            <div class="register-card">
              ${errorBanner}

              <form action="/register" method="POST" id="registerForm">
                <!-- 1. ROL SEÇİMİ -->
                <div class="section-label">1. Üyelik Türü Seçin</div>
                <div class="role-selector-grid" role="radiogroup" aria-label="Üyelik Türü">
                  <label class="role-card ${selectedRole === 'alumni' ? 'active' : ''}" data-role-card="alumni">
                    <input type="radio" name="role" value="alumni" ${selectedRole === 'alumni' ? 'checked' : ''}>
                    <span class="role-card-title">Mezun (Alumni)</span>
                    <span class="role-card-desc">Kariyer bilgisi paylaşın, iş ilanı açın ve mentörlük verin.</span>
                  </label>

                  <label class="role-card ${selectedRole === 'student' ? 'active' : ''}" data-role-card="student">
                    <input type="radio" name="role" value="student" ${selectedRole === 'student' ? 'checked' : ''}>
                    <span class="role-card-title">Öğrenci (Student)</span>
                    <span class="role-card-desc">İş ve staj ilanlarına başvurun, mezunlardan mentörlük alın.</span>
                  </label>

                  <label class="role-card ${selectedRole === 'academic_staff' ? 'active' : ''}" data-role-card="academic_staff">
                    <input type="radio" name="role" value="academic_staff" ${selectedRole === 'academic_staff' ? 'checked' : ''}>
                    <span class="role-card-title">Akademik Personel</span>
                    <span class="role-card-desc">Duyuru ve etkinlik yayınlayın, bölüm mezunlarını takip edin.</span>
                  </label>
                </div>

                <hr class="section-divider">

                <!-- 2. TEMEL HESAP BİLGİLERİ -->
                <div class="section-label">2. Temel Kimlik & İletişim Bilgileri</div>
                <div class="form-grid">
                  <div class="form-group">
                    <label for="first_name">Ad *</label>
                    <input type="text" id="first_name" name="first_name" value="${escapeHtml(formData.first_name || '')}" placeholder="ör. Zeynep" required>
                  </div>

                  <div class="form-group">
                    <label for="last_name">Soyad *</label>
                    <input type="text" id="last_name" name="last_name" value="${escapeHtml(formData.last_name || '')}" placeholder="ör. Kaya" required>
                  </div>

                  <div class="form-group">
                    <label for="email">E-posta Adresi *</label>
                    <input type="email" id="email" name="email" value="${escapeHtml(formData.email || '')}" placeholder="ör. zeynep.kaya@istanbul.edu.tr" required>
                  </div>

                  <div class="form-group">
                    <label for="phone">Telefon</label>
                    <input type="tel" id="phone" name="phone" value="${escapeHtml(formData.phone || '')}" placeholder="ör. +90 555 123 45 67">
                  </div>

                  <div class="form-group" style="grid-column: 1 / -1;">
                    <label for="department_id">Bölüm *</label>
                    <select id="department_id" name="department_id" required>
                      <option value="">Bölüm seçiniz...</option>
                      ${departmentOptions}
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="password">Şifre *</label>
                    <input type="password" id="password" name="password" minlength="6" placeholder="En az 6 karakter" required>
                    <span class="field-hint">Güvenliğiniz için en az 6 karakter olmalıdır.</span>
                  </div>

                  <div class="form-group">
                    <label for="confirm_password">Şifre Tekrar *</label>
                    <input type="password" id="confirm_password" name="confirm_password" minlength="6" placeholder="Şifrenizi tekrar girin" required>
                  </div>
                </div>

                <hr class="section-divider">

                <!-- 3. ROLE ÖZGÜ PROFİL BİLGİLERİ -->
                <div class="section-label">3. Rol Profil Detayları</div>

                <!-- ALUMNI SECTION -->
                <div class="role-section ${selectedRole === 'alumni' ? 'active' : ''}" data-role-section="alumni">
                  <div class="form-grid">
                    <div class="form-group">
                      <label for="graduation_year">Mezuniyet Yılı *</label>
                      <input type="number" id="graduation_year" name="graduation_year" min="1950" max="2030" value="${escapeHtml(formData.graduation_year || '2022')}" data-role-required="alumni">
                    </div>

                    <div class="form-group">
                      <label for="alumni_degree">Derece</label>
                      <select id="alumni_degree" name="degree">
                        <option value="Bachelor" ${formData.degree === 'Bachelor' ? 'selected' : ''}>Lisans (Bachelor)</option>
                        <option value="Master" ${formData.degree === 'Master' ? 'selected' : ''}>Yüksek Lisans (Master)</option>
                        <option value="PhD" ${formData.degree === 'PhD' ? 'selected' : ''}>Doktora (PhD)</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label for="current_job_title">Güncel Pozisyon</label>
                      <input type="text" id="current_job_title" name="current_job_title" value="${escapeHtml(formData.current_job_title || '')}" placeholder="ör. Kıdemli İş Analisti">
                    </div>

                    <div class="form-group">
                      <label for="current_company">Şirket / Kurum</label>
                      <input type="text" id="current_company" name="current_company" value="${escapeHtml(formData.current_company || '')}" placeholder="ör. Tech Solutions A.Ş.">
                    </div>

                    <div class="form-group">
                      <label for="current_city">Şehir</label>
                      <input type="text" id="current_city" name="current_city" value="${escapeHtml(formData.current_city || '')}" placeholder="ör. İstanbul">
                    </div>

                    <div class="form-group" style="justify-content: flex-end;">
                      <label class="checkbox-row" for="available_for_mentorship">
                        <input type="checkbox" id="available_for_mentorship" name="available_for_mentorship" ${formData.available_for_mentorship ? 'checked' : ''}>
                        <span>Öğrencilere mentörlük vermeye açığım</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- STUDENT SECTION -->
                <div class="role-section ${selectedRole === 'student' ? 'active' : ''}" data-role-section="student">
                  <div class="form-grid">
                    <div class="form-group">
                      <label for="student_number">Öğrenci Numarası *</label>
                      <input type="text" id="student_number" name="student_number" value="${escapeHtml(formData.student_number || '')}" placeholder="ör. 2024001085" data-role-required="student">
                    </div>

                    <div class="form-group">
                      <label for="student_degree">Eğitim Düzeyi</label>
                      <select id="student_degree" name="degree">
                        <option value="Bachelor" ${formData.degree === 'Bachelor' ? 'selected' : ''}>Lisans (Bachelor)</option>
                        <option value="Master" ${formData.degree === 'Master' ? 'selected' : ''}>Yüksek Lisans (Master)</option>
                        <option value="PhD" ${formData.degree === 'PhD' ? 'selected' : ''}>Doktora (PhD)</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label for="enrollment_year">Giriş Yılı *</label>
                      <input type="number" id="enrollment_year" name="enrollment_year" min="2000" max="2030" value="${escapeHtml(formData.enrollment_year || '2023')}" data-role-required="student">
                    </div>

                    <div class="form-group">
                      <label for="expected_graduation_year">Tahmini Mezuniyet Yılı *</label>
                      <input type="number" id="expected_graduation_year" name="expected_graduation_year" min="2024" max="2035" value="${escapeHtml(formData.expected_graduation_year || '2027')}" data-role-required="student">
                    </div>

                    <div class="form-group" style="grid-column: 1 / -1;">
                      <label for="interests">İlgi Alanları & Teknolojiler</label>
                      <input type="text" id="interests" name="interests" value="${escapeHtml(formData.interests || '')}" placeholder="ör. Veri Analitiği, Full-Stack Web, ERP Sistemleri">
                    </div>
                  </div>
                </div>

                <!-- ACADEMIC STAFF SECTION -->
                <div class="role-section ${selectedRole === 'academic_staff' ? 'active' : ''}" data-role-section="academic_staff">
                  <div class="form-grid">
                    <div class="form-group">
                      <label for="academic_title">Akademik Unvan *</label>
                      <select id="academic_title" name="academic_title" data-role-required="academic_staff">
                        <option value="Prof. Dr." ${formData.academic_title === 'Prof. Dr.' ? 'selected' : ''}>Prof. Dr.</option>
                        <option value="Doç. Dr." ${formData.academic_title === 'Doç. Dr.' ? 'selected' : ''}>Doç. Dr.</option>
                        <option value="Dr. Öğr. Üyesi" ${formData.academic_title === 'Dr. Öğr. Üyesi' ? 'selected' : ''}>Dr. Öğr. Üyesi</option>
                        <option value="Öğr. Gör." ${formData.academic_title === 'Öğr. Gör.' ? 'selected' : ''}>Öğr. Gör.</option>
                        <option value="Arş. Gör." ${formData.academic_title === 'Arş. Gör.' ? 'selected' : ''}>Arş. Gör.</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label for="office_location">Ofis / Oda</label>
                      <input type="text" id="office_location" name="office_location" value="${escapeHtml(formData.office_location || '')}" placeholder="ör. İktisat Fakültesi Kat 3, Oda 312">
                    </div>

                    <div class="form-group" style="grid-column: 1 / -1;">
                      <label for="research_areas">Araştırma Alanları</label>
                      <input type="text" id="research_areas" name="research_areas" value="${escapeHtml(formData.research_areas || '')}" placeholder="ör. Yönetim Bilişim Sistemleri, Karar Destek Sistemleri, Yapay Zekâ">
                    </div>
                  </div>
                </div>

                <div class="form-actions">
                  <a href="/users" class="btn btn-secondary">Kayıtlı Kullanıcılar</a>
                  <button type="submit" class="btn btn-accent-green">Hesabı Oluştur →</button>
                </div>
              </form>
            </div>
          </div>
        </main>

        ${MintlifyTheme.renderFooter()}

        <script>
          (function () {
            const roleRadios = document.querySelectorAll('input[name="role"]');
            const roleCards = document.querySelectorAll('.role-card');
            const roleSections = document.querySelectorAll('.role-section');

            function syncRoleUI(role) {
              roleCards.forEach(card => {
                card.classList.toggle('active', card.dataset.roleCard === role);
              });

              roleSections.forEach(section => {
                const isActive = section.dataset.roleSection === role;
                section.classList.toggle('active', isActive);

                section.querySelectorAll('input, select, textarea').forEach(field => {
                  field.disabled = !isActive;
                  if (field.dataset.roleRequired) {
                    field.required = isActive;
                  }
                });
              });
            }

            roleRadios.forEach(radio => {
              radio.addEventListener('change', (e) => syncRoleUI(e.target.value));
            });

            const checkedRadio = document.querySelector('input[name="role"]:checked');
            syncRoleUI(checkedRadio ? checkedRadio.value : 'alumni');

            const form = document.getElementById('registerForm');
            form.addEventListener('submit', function (e) {
              const pwd = document.getElementById('password').value;
              const confirm = document.getElementById('confirm_password').value;
              if (pwd !== confirm) {
                e.preventDefault();
                alert('Şifre ve Şifre Tekrar alanları eşleşmiyor. Lütfen kontrol ediniz.');
              }
            });
          })();
        </script>
      </body>
      </html>
    `;
  },

  /**
   * Render Registration Success Page (POST /register)
   */
  renderRegisterSuccessPage({ user, departmentName }) {
    const roleLabel = ROLE_LABELS[user.role] || user.role;
    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kayıt Başarılı — İÜ YBS</title>
        <style>
          ${MintlifyTheme.getBaseStyles()}
          .summary-box {
            text-align: left;
            background-color: var(--surface-soft);
            border: 1px solid var(--hairline);
            border-radius: var(--rounded-md);
            padding: 16px 20px;
            margin: 20px 0 24px;
            display: grid;
            gap: 10px;
            font-size: 14px;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            border-bottom: 1px solid var(--hairline-soft);
            padding-bottom: 8px;
          }
          .summary-row:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }
          .summary-key {
            color: var(--steel);
            font-weight: 500;
          }
          .summary-val {
            color: var(--ink);
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        ${MintlifyTheme.renderHeader('register')}
        <main class="page-main">
          <div class="page-container" style="max-width: 580px; margin-top: 56px;">
            <div class="card-base" style="text-align: center; padding: 36px;">
              <span class="badge-green" style="margin-bottom: 14px;">Kayıt Tamamlandı</span>
              <h1 style="font-size: 24px; font-weight: 600; color: var(--ink); margin-bottom: 8px;">Hoş Geldiniz, ${escapeHtml(user.name)}</h1>
              <p style="font-size: 15px; color: var(--steel);">Hesabınız ve rol profiliniz PostgreSQL veritabanına başarıyla kaydedildi.</p>

              <div class="summary-box">
                <div class="summary-row">
                  <span class="summary-key">Kullanıcı ID</span>
                  <span class="summary-val"><span class="code-inline">#${user.id}</span></span>
                </div>
                <div class="summary-row">
                  <span class="summary-key">E-posta</span>
                  <span class="summary-val">${escapeHtml(user.email)}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-key">Rol</span>
                  <span class="summary-val"><span class="badge-tag">${escapeHtml(roleLabel)}</span></span>
                </div>
                <div class="summary-row">
                  <span class="summary-key">Bölüm</span>
                  <span class="summary-val">${escapeHtml(departmentName || '-')}</span>
                </div>
              </div>

              <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <a href="/users/${user.id}" class="btn btn-primary">Profili Görüntüle</a>
                <a href="/users" class="btn btn-secondary">Tüm Kullanıcılar</a>
                <a href="/home" class="btn btn-secondary">Ana Sayfa</a>
              </div>
            </div>
          </div>
        </main>
        ${MintlifyTheme.renderFooter()}
      </body>
      </html>
    `;
  },

  /**
   * Render Login Page (GET /login)
   */
  renderLoginPage({ formData = {}, error = null, info = null } = {}) {
    const errorBanner = error
      ? `<div class="alert-error" role="alert"><strong>Giriş Başarısız:</strong> ${escapeHtml(error)}</div>`
      : '';
    const infoBanner = info
      ? `<div class="alert-info" role="status">${escapeHtml(info)}</div>`
      : '';

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Giriş Yap — İÜ YBS Mezun & Kariyer Portalı</title>
        <style>
          ${MintlifyTheme.getBaseStyles()}

          .login-shell {
            max-width: 480px;
            margin: 56px auto 80px;
            padding: 0 24px;
          }

          .login-card {
            background-color: var(--canvas);
            border: 1px solid var(--hairline);
            border-radius: var(--rounded-xl);
            padding: 32px;
          }

          .password-wrap {
            position: relative;
            display: flex;
            align-items: center;
          }

          .password-wrap input {
            width: 100%;
            padding-right: 76px;
          }

          .toggle-pwd-btn {
            position: absolute;
            right: 8px;
            background: var(--surface);
            border: 1px solid var(--hairline);
            border-radius: var(--rounded-sm);
            padding: 4px 10px;
            font-size: 12px;
            font-weight: 500;
            color: var(--charcoal);
            cursor: pointer;
          }

          .toggle-pwd-btn:hover {
            background: var(--hairline-soft);
          }

          .checkbox-row {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: var(--steel);
            cursor: pointer;
            margin-top: 4px;
          }

          .checkbox-row input[type="checkbox"] {
            width: 15px;
            height: 15px;
            accent-color: var(--brand-green-deep);
          }

          .alert-error {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            color: #991b1b;
            padding: 12px 16px;
            border-radius: var(--rounded-md);
            font-size: 14px;
            margin-bottom: 18px;
          }

          .alert-info {
            background-color: #ecfdf5;
            border: 1px solid #a7f3d0;
            color: #065f46;
            padding: 12px 16px;
            border-radius: var(--rounded-md);
            font-size: 14px;
            margin-bottom: 18px;
          }

          .login-footer-link {
            text-align: center;
            margin-top: 20px;
            padding-top: 18px;
            border-top: 1px solid var(--hairline-soft);
            font-size: 14px;
            color: var(--steel);
          }

          .login-footer-link a {
            color: var(--ink);
            font-weight: 600;
            text-decoration: none;
          }

          .login-footer-link a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        ${MintlifyTheme.renderHeader('login')}

        <main class="page-main">
          <div class="login-shell">
            <div style="margin-bottom: 22px;">
              <span class="section-kicker"><span class="mint-dot"></span> OTURUM AÇMA</span>
              <h1 class="page-title">Portala Giriş Yap</h1>
              <p class="page-subtitle">Kayıtlı e-posta adresiniz ve şifrenizle oturum açın.</p>
            </div>

            <div class="login-card">
              ${errorBanner}
              ${infoBanner}

              <form action="/login" method="POST" style="display: grid; gap: 16px;">
                <div class="form-group">
                  <label for="email">E-posta Adresi</label>
                  <input type="email" id="email" name="email" value="${escapeHtml(formData.email || '')}" placeholder="ör. zeynep.kaya@istanbul.edu.tr" required autofocus>
                </div>

                <div class="form-group">
                  <label for="password">Şifre</label>
                  <div class="password-wrap">
                    <input type="password" id="password" name="password" placeholder="Şifreniz" required>
                    <button type="button" class="toggle-pwd-btn" id="togglePwdBtn">Göster</button>
                  </div>
                </div>

                <label class="checkbox-row" for="remember_me">
                  <input type="checkbox" id="remember_me" name="remember_me" ${formData.remember_me ? 'checked' : ''}>
                  <span>Oturumu açık tut (7 gün)</span>
                </label>

                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 4px;">Giriş Yap →</button>
              </form>

              <div class="login-footer-link">
                Henüz hesabınız yok mu? <a href="/register">Kayıt Olun</a>
              </div>
            </div>
          </div>
        </main>

        ${MintlifyTheme.renderFooter()}

        <script>
          (function () {
            const btn = document.getElementById('togglePwdBtn');
            const input = document.getElementById('password');
            if (btn && input) {
              btn.addEventListener('click', function () {
                const isPwd = input.type === 'password';
                input.type = isPwd ? 'text' : 'password';
                btn.textContent = isPwd ? 'Gizle' : 'Göster';
              });
            }
          })();
        </script>
      </body>
      </html>
    `;
  }
};

module.exports = AuthViews;
