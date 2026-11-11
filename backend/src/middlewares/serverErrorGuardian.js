const { logErrorToFile } = require('../utils/fileLogger');

/**
 * 5xx Guardian Middleware
 * Express global error-handling middleware that intercepts server-side errors
 * and returns a structured 5xx response containing an explicit reason for failure.
 * Also persists detailed error traces to logs/error.logs.
 * 
 * Supports both JSON (for REST API clients) and styled HTML (for browser clients).
 */

function determine5xxReason(err, req) {
  if (!err) {
    return 'An unexpected server error occurred without an error description.';
  }

  if (err.reason) {
    return err.reason;
  }

  // PostgreSQL-specific error codes
  if (err.code === '23505') {
    return `Database Unique Constraint Error: A duplicate record already exists (${err.detail || 'unique constraint violation'}).`;
  }
  if (err.code === '23503') {
    return `Database Foreign Key Error: Referenced entity not found or foreign key constraint failed (${err.detail || 'relation error'}).`;
  }
  if (err.code === '23502') {
    return `Database Not-Null Violation: Required column '${err.column || 'field'}' was omitted.`;
  }
  if (err.code === 'ECONNREFUSED' || (err.code && err.code.startsWith('08'))) {
    return 'Database Connection Unavailable: Could not establish a connection to the PostgreSQL database.';
  }

  // JSON parsing and syntax errors
  if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
    return `Payload Syntax Error: Failed to parse request body as valid JSON. Details: ${err.message}`;
  }

  // Type and validation errors
  if (err.name === 'ValidationError') {
    return `Model Validation Error: ${err.message}`;
  }

  if (err.message) {
    return `Server Processing Error: ${err.message}`;
  }

  return 'Internal Server Error: The server encountered an unexpected condition that prevented fulfilling the request.';
}

function serverErrorGuardian(err, req, res, next) {
  // Determine HTTP status code (must be 5xx or fall back to 500)
  let statusCode = 500;
  if (err.status && err.status >= 500 && err.status < 600) {
    statusCode = err.status;
  } else if (err.statusCode && err.statusCode >= 500 && err.statusCode < 600) {
    statusCode = err.statusCode;
  }

  const reason = determine5xxReason(err, req);
  const method = req.method;
  const path = req.originalUrl || req.url;
  const timestamp = new Date().toISOString();

  // Log error stack to server terminal for debugging
  console.error(`\x1b[31m[5xx Guardian] ${method} ${path} -> ${statusCode} Internal Error:\x1b[0m`, err);

  // Persist server error to logs/error.logs
  logErrorToFile({
    statusCode: statusCode,
    method: method,
    url: path,
    reason: reason,
    details: err.message,
    stack: err.stack
  });

  const errorPayload = {
    status: statusCode,
    error: 'Internal Server Error',
    reason: reason,
    method: method,
    path: path,
    timestamp: timestamp,
    documentation: '/api/swagger'
  };

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    errorPayload.details = err.message;
  }

  // Content negotiation: return JSON for API requests or when client prefers JSON
  if (path.startsWith('/api') || (req.accepts('json') && !req.accepts('html'))) {
    return res.status(statusCode).json(errorPayload);
  }

  // HTML response for browser requests
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${statusCode} Server Error - 5xx Guardian</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0b0f19;
      color: #f1f5f9;
      font-family: 'Inter', -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .guardian-card {
      background: #111827;
      border: 1px solid #374151;
      border-radius: 16px;
      max-width: 600px;
      width: 100%;
      padding: 40px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
      text-align: center;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(168, 85, 247, 0.15);
      color: #c084fc;
      border: 1px solid rgba(168, 85, 247, 0.3);
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    .error-code {
      font-size: 72px;
      font-weight: 800;
      line-height: 1;
      background: linear-gradient(135deg, #a855f7 0%, #ef4444 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 12px;
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 16px;
    }
    .reason-box {
      background: #1e293b;
      border-left: 4px solid #a855f7;
      border-radius: 8px;
      padding: 16px;
      text-align: left;
      margin: 24px 0;
    }
    .reason-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #94a3b8;
      margin-bottom: 6px;
    }
    .reason-text {
      font-size: 14px;
      color: #f1f5f9;
      line-height: 1.5;
    }
    .endpoint-pill {
      display: inline-block;
      font-family: 'JetBrains Mono', monospace;
      background: #0f172a;
      color: #c084fc;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 13px;
      margin-top: 8px;
    }
    .actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 28px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
    }
    .btn-primary {
      background: #7c3aed;
      color: #ffffff;
      border: none;
    }
    .btn-primary:hover { background: #6d28d9; }
    .btn-secondary {
      background: #1f2937;
      color: #cbd5e1;
      border: 1px solid #374151;
    }
    .btn-secondary:hover { background: #374151; color: #ffffff; }
    .footer-note {
      margin-top: 24px;
      font-size: 12px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="guardian-card">
    <div class="badge">🛡️ 5xx Guardian</div>
    <div class="error-code">${statusCode}</div>
    <h1>Internal Server Error</h1>
    <div class="reason-box">
      <div class="reason-title">Reason for Failure:</div>
      <div class="reason-text">${reason}</div>
      <div class="endpoint-pill">${method} ${path}</div>
    </div>
    <div class="actions">
      <a href="javascript:location.reload()" class="btn btn-primary">🔄 Retry Request</a>
      <a href="/home" class="btn btn-secondary">🏠 Return to Home</a>
    </div>
    <div class="footer-note">Handled by 5xx Guardian Middleware • ${timestamp}</div>
  </div>
</body>
</html>`;

  return res.status(statusCode).send(html);
}

module.exports = serverErrorGuardian;

