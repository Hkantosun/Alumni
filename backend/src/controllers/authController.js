/**
 * AuthController - Web Controller for User Registration
 */

const UserModel = require('../models/userModel');
const DepartmentModel = require('../models/departmentModel');
const AuthViews = require('../views/authViews');
const {
  signSessionToken,
  setSessionCookie,
  clearSessionCookie
} = require('../utils/sessionAuth');

const ALLOWED_SELF_REGISTER_ROLES = ['alumni', 'student', 'academic_staff'];

const AuthController = {
  /**
   * GET /register - Render registration form
   */
  async renderRegister(req, res, next) {
    try {
      const departments = await DepartmentModel.getAll();
      res.send(AuthViews.renderRegisterPage({ departments }));
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /register - Validate input, create user + role profile in a transaction
   */
  async register(req, res, next) {
    const formData = req.body || {};
    try {
      const departments = await DepartmentModel.getAll();

      const renderError = (statusCode, message) => {
        return res.status(statusCode).send(
          AuthViews.renderRegisterPage({ departments, formData, error: message })
        );
      };

      const firstName = (formData.first_name || '').trim();
      const lastName = (formData.last_name || '').trim();
      const email = (formData.email || '').trim().toLowerCase();
      const password = formData.password || '';
      const confirmPassword = formData.confirm_password || '';
      const role = (formData.role || '').trim().toLowerCase();
      const departmentId = parseInt(formData.department_id, 10);

      if (!firstName || !lastName || !email || !password) {
        return renderError(400, 'Ad, soyad, e-posta ve şifre alanları zorunludur.');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return renderError(400, 'Lütfen geçerli bir e-posta adresi giriniz.');
      }

      if (password.length < 6) {
        return renderError(400, 'Şifre en az 6 karakter uzunluğunda olmalıdır.');
      }

      if (password !== confirmPassword) {
        return renderError(400, 'Şifre ve şifre tekrarı birbiriyle eşleşmiyor.');
      }

      if (!ALLOWED_SELF_REGISTER_ROLES.includes(role)) {
        return renderError(400, 'Geçersiz üyelik türü seçildi.');
      }

      const selectedDept = departments.find(d => d.id === departmentId);
      if (!selectedDept) {
        return renderError(400, 'Lütfen geçerli bir bölüm seçiniz.');
      }

      // Role-specific validation
      if (role === 'alumni') {
        const gradYear = parseInt(formData.graduation_year, 10);
        if (isNaN(gradYear) || gradYear < 1950 || gradYear > 2035) {
          return renderError(400, 'Lütfen 1950 veya sonrası için geçerli bir mezuniyet yılı giriniz.');
        }
      } else if (role === 'student') {
        const studentNumber = (formData.student_number || '').trim();
        const enrollmentYear = parseInt(formData.enrollment_year, 10);
        const expectedGradYear = parseInt(formData.expected_graduation_year, 10);
        if (!studentNumber) {
          return renderError(400, 'Öğrenci kaydı için öğrenci numarası zorunludur.');
        }
        if (isNaN(enrollmentYear) || isNaN(expectedGradYear) || expectedGradYear < enrollmentYear) {
          return renderError(400, 'Tahmini mezuniyet yılı, giriş yılından küçük olamaz.');
        }
      } else if (role === 'academic_staff') {
        if (!(formData.academic_title || '').trim()) {
          return renderError(400, 'Akademik personel kaydı için akademik unvan zorunludur.');
        }
      }

      // Check existing email early
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return renderError(409, 'Bu e-posta adresi ile sistemde zaten kayıtlı bir hesap bulunmaktadır.');
      }

      const { user, profile } = await UserModel.registerWithProfile(formData);
      return res.status(201).send(
        AuthViews.renderRegisterSuccessPage({
          user,
          profile,
          departmentName: `${selectedDept.code} — ${selectedDept.name}`
        })
      );
    } catch (err) {
      if (err && err.code === '23505') {
        const departments = await DepartmentModel.getAll().catch(() => []);
        const detail = err.constraint && err.constraint.includes('student_number')
          ? 'Bu öğrenci numarası sistemde zaten kayıtlıdır.'
          : 'Bu e-posta veya benzersiz bilgi sistemde zaten kayıtlıdır.';
        return res.status(409).send(
          AuthViews.renderRegisterPage({ departments, formData, error: detail })
        );
      }
      next(err);
    }
  },

  /**
   * GET /login - Render login form
   */
  renderLogin(req, res) {
    if (req.user) {
      return res.redirect('/home');
    }
    const info = req.query.loggedOut ? 'Oturumunuz güvenli bir şekilde sonlandırıldı.' : null;
    res.send(AuthViews.renderLoginPage({ info }));
  },

  /**
   * POST /login - Authenticate user and issue signed HttpOnly session cookie
   */
  async login(req, res, next) {
    const formData = req.body || {};
    try {
      const email = (formData.email || '').trim().toLowerCase();
      const password = formData.password || '';
      const rememberMe = formData.remember_me === 'on' || formData.remember_me === true || formData.remember_me === 'true';

      if (!email || !password) {
        return res.status(400).send(
          AuthViews.renderLoginPage({
            formData,
            error: 'E-posta adresi ve şifre alanları zorunludur.'
          })
        );
      }

      const user = await UserModel.findAuthByEmail(email);
      if (!user || !UserModel.verifyPassword(password, user.password_hash)) {
        return res.status(401).send(
          AuthViews.renderLoginPage({
            formData,
            error: 'E-posta adresi veya şifre hatalı.'
          })
        );
      }

      if (!user.is_active) {
        return res.status(403).send(
          AuthViews.renderLoginPage({
            formData,
            error: 'Hesabınız askıya alınmış veya pasif durumdadır. Lütfen yönetici ile iletişime geçiniz.'
          })
        );
      }

      const ttlSeconds = rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60;
      const token = signSessionToken(user, ttlSeconds);
      setSessionCookie(res, token, ttlSeconds);

      return res.redirect('/home');
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /logout & GET /logout - Clear session cookie and redirect to login
   */
  logout(req, res) {
    clearSessionCookie(res);
    return res.redirect('/login?loggedOut=1');
  }
};

module.exports = AuthController;
