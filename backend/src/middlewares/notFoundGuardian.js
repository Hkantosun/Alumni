const { logErrorToFile } = require('../utils/fileLogger');
const NotFoundView = require('../views/notFoundView');

/**
 * 404 Guardian Middleware
 * Catches all unmatched and invalid requests:
 * 1. Persists the error and reason into logs/error.logs
 * 2. Returns 404 JSON for REST API requests
 * 3. Redirects invalid web requests to the defined generic 404 page (/404)
 */

function determineReason(req) {
  const url = req.originalUrl || req.url;
  const method = req.method;

  if (url.startsWith('/api/')) {
    return `The requested API endpoint '${method} ${url}' does not exist on this server. Please verify the URL path, HTTP method, and query parameters.`;
  }
  return `The requested URL '${url}' does not match any registered route or view. The resource may have been moved, deleted, or mistyped.`;
}

function notFoundGuardian(req, res, next) {
  const reason = res.locals.notFoundReason || req.notFoundReason || determineReason(req);
  const method = req.method;
  const path = req.originalUrl || req.url;
  const timestamp = new Date().toISOString();

  // Persist 404 error to logs/error.logs
  logErrorToFile({
    statusCode: 404,
    method: method,
    url: path,
    reason: reason
  });

  // REST API Clients: return structured 404 JSON
  if (path.startsWith('/api') || (req.accepts('json') && !req.accepts('html'))) {
    return res.status(404).json({
      status: 404,
      error: 'Not Found',
      reason: reason,
      method: method,
      path: path,
      timestamp: timestamp,
      documentation: '/api/swagger'
    });
  }

  // Prevent redirect loops if /404 itself is requested
  if (req.path === '/404') {
    return res.status(404).send(NotFoundView.renderNotFoundPage({
      requestedUrl: req.query.requestedUrl || path,
      reason: req.query.reason || reason,
      method: req.query.method || method
    }));
  }

  // Redirect invalid web / browser requests to the generic 404 page
  const redirectTarget = `/404?requestedUrl=${encodeURIComponent(path)}&reason=${encodeURIComponent(reason)}&method=${encodeURIComponent(method)}`;
  return res.redirect(302, redirectTarget);
}

module.exports = notFoundGuardian;
