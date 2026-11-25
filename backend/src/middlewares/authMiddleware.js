/**
 * Auth & Authorization Middleware (RBAC + Account Status + Ownership)
 * Implements the pipeline defined in ddd.md Section 6.4:
 *   1. authenticate         -> Verifies cookie or Bearer session token (401 Unauthorized)
 *   2. checkAccountStatus   -> Verifies is_active & optional is_verified (403 Forbidden)
 *   3. authorize(...roles)  -> Verifies user role against allowed roles (403 Forbidden)
 *   4. requireOwnership(fn) -> Verifies resource ownership or admin override (403 Forbidden)
 */

const UserModel = require('../models/userModel');
const MintlifyTheme = require('../views/mintlifyTheme');
const { verifySessionToken } = require('../utils/sessionAuth');
const { logErrorToFile } = require('../utils/fileLogger');

const { escapeHtml } = MintlifyTheme;

function isApiRequest(req) {
  const path = req.originalUrl || req.url || '';
  return path.startsWith('/api') || (req.accepts('json') && !req.accepts('html'));
}

function sendAuthError(req, res, { statusCode, errorTitle, reason }) {
  const method = req.method;
  const path = req.originalUrl || req.url;
  const actor = req.user ? `user#${req.user.id}(${req.user.role})` : 'guest';

  logErrorToFile({
    statusCode,
    method,
    url: path,
    reason: `[${actor}] ${reason}`
  });

  if (isApiRequest(req)) {
    return res.status(statusCode).json({
      status: statusCode,
      error: errorTitle,
      reason,
      method,
      path,
      timestamp: new Date().toISOString()
    });
  }

  if (statusCode === 401) {
    return res.redirect(302, '/login');
  }

  return res.status(statusCode).send(`
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${statusCode} ${escapeHtml(errorTitle)} — İÜ YBS</title>
      <style>${MintlifyTheme.getBaseStyles()}</style>
    </head>
    <body>
      ${MintlifyTheme.renderHeader('home')}
      <main class="page-main">
        <div class="page-container" style="max-width: 560px; margin-top: 64px;">
          <div class="card-base" style="text-align: center; padding: 36px;">
            <span class="badge-tag" style="margin-bottom: 14px;">HTTP ${statusCode}</span>
            <h1 style="font-size: 24px; font-weight: 600; color: var(--ink); margin-bottom: 10px;">${escapeHtml(errorTitle)}</h1>
            <p style="font-size: 15px; color: var(--steel); margin-bottom: 24px;">${escapeHtml(reason)}</p>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
              <a href="/home" class="btn btn-primary">Ana Sayfaya Dön</a>
              <a href="/login" class="btn btn-secondary">Giriş Yap</a>
            </div>
          </div>
        </div>
      </main>
      ${MintlifyTheme.renderFooter()}
    </body>
    </html>
  `);
}

/**
 * 1. authenticate - Requires a valid session cookie or Bearer token.
 */
function authenticate(req, res, next) {
  let user = req.user || null;

  if (!user) {
    const authHeader = req.headers.authorization || '';
    if (authHeader.startsWith('Bearer ')) {
      const bearerToken = authHeader.slice(7).trim();
      user = verifySessionToken(bearerToken);
      if (user) {
        req.user = user;
        res.locals.currentUser = user;
      }
    }
  }

  if (!user) {
    return sendAuthError(req, res, {
      statusCode: 401,
      errorTitle: 'Unauthorized',
      reason: 'Bu kaynağa erişmek için geçerli bir oturum açmanız gerekmektedir.'
    });
  }

  return next();
}

/**
 * 2. checkAccountStatus - Ensures the authenticated user's account is active (and optionally verified).
 */
function checkAccountStatus({ requireVerified = false } = {}) {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return sendAuthError(req, res, {
          statusCode: 401,
          errorTitle: 'Unauthorized',
          reason: 'Oturum bilgisi bulunamadı.'
        });
      }

      const dbUser = await UserModel.getById(req.user.id);
      if (!dbUser) {
        return sendAuthError(req, res, {
          statusCode: 401,
          errorTitle: 'Unauthorized',
          reason: 'Oturuma ait kullanıcı hesabı artık mevcut değil.'
        });
      }

      if (!dbUser.is_active) {
        return sendAuthError(req, res, {
          statusCode: 403,
          errorTitle: 'Forbidden',
          reason: 'Hesabınız pasif veya askıya alınmış durumdadır.'
        });
      }

      if (requireVerified && !dbUser.is_verified) {
        return sendAuthError(req, res, {
          statusCode: 403,
          errorTitle: 'Forbidden',
          reason: 'Bu işlemi gerçekleştirmek için e-posta doğrulamasını tamamlamanız gerekmektedir.'
        });
      }

      req.user.role = dbUser.role;
      req.user.is_active = dbUser.is_active;
      req.user.is_verified = dbUser.is_verified;
      return next();
    } catch (err) {
      return next(err);
    }
  };
}

/**
 * 3. authorize - Role-Based Access Control (RBAC) guard.
 */
function authorize(...allowedRoles) {
  const normalizedAllowed = allowedRoles.map(r => String(r).toLowerCase());

  return (req, res, next) => {
    if (!req.user) {
      return sendAuthError(req, res, {
        statusCode: 401,
        errorTitle: 'Unauthorized',
        reason: 'Yetki kontrolü için oturum açmanız gerekmektedir.'
      });
    }

    const userRole = String(req.user.role || '').toLowerCase();
    if (!normalizedAllowed.includes(userRole)) {
      return sendAuthError(req, res, {
        statusCode: 403,
        errorTitle: 'Forbidden',
        reason: `Bu işlem için yetkiniz bulunmamaktadır. Gerekli roller: [${normalizedAllowed.join(', ')}].`
      });
    }

    return next();
  };
}

/**
 * 4. requireOwnership - Verifies resource ownership (with admin bypass).
 */
function requireOwnership(getOwnerIdFn) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return sendAuthError(req, res, {
          statusCode: 401,
          errorTitle: 'Unauthorized',
          reason: 'Sahiplik kontrolü için oturum açmanız gerekmektedir.'
        });
      }

      if (String(req.user.role || '').toLowerCase() === 'admin') {
        return next();
      }

      const ownerId = await getOwnerIdFn(req);
      if (ownerId === null || ownerId === undefined || Number(ownerId) !== Number(req.user.id)) {
        return sendAuthError(req, res, {
          statusCode: 403,
          errorTitle: 'Forbidden',
          reason: 'Yalnızca kendi oluşturduğunuz veya size ait kaynaklar üzerinde işlem yapabilirsiniz.'
        });
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = {
  authenticate,
  checkAccountStatus,
  authorize,
  requireOwnership
};
