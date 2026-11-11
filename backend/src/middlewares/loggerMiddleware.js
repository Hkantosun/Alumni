const { logRequestToFile } = require('../utils/fileLogger');

/**
 * Logger Middleware
 * Intercepts incoming HTTP requests and logs method, URL, status code,
 * response duration, and timestamp to the terminal and log files.
 */
function loggerMiddleware(req, res, next) {
  const startTime = process.hrtime();
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  // Once response headers and body are fully sent
  res.on('finish', () => {
    const diff = process.hrtime(startTime);
    const durationMs = ((diff[0] * 1e3) + (diff[1] / 1e6)).toFixed(2);
    const method = req.method;
    const url = req.originalUrl || req.url;
    const statusCode = res.statusCode;

    // ANSI color coding for terminal status codes
    let statusColor = '\x1b[0m'; // default
    if (statusCode >= 500) {
      statusColor = '\x1b[31m'; // red for server errors
    } else if (statusCode >= 400) {
      statusColor = '\x1b[33m'; // yellow for client errors
    } else if (statusCode >= 300) {
      statusColor = '\x1b[36m'; // cyan for redirects
    } else if (statusCode >= 200) {
      statusColor = '\x1b[32m'; // green for success
    }

    console.log(`[${timestamp}] ${method} ${url} ${statusColor}${statusCode}\x1b[0m - ${durationMs}ms`);

    // Write access log to logs/combined.logs
    logRequestToFile({ statusCode, method, url, durationMs });
  });

  next();
}

module.exports = loggerMiddleware;

