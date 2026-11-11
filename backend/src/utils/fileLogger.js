const fs = require('fs');
const path = require('path');

// Determine logs directory (supports Docker /app/logs as well as local runtime)
const logsDir = process.env.LOGS_DIR || path.resolve(process.cwd(), 'logs');

// Ensure directory exists
try {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
} catch (err) {
  console.error('[FileLogger] Failed to create logs directory:', err.message);
}

const errorLogPath = path.join(logsDir, 'error.logs');
const allLogPath = path.join(logsDir, 'combined.logs');

/**
 * Append error information to logs/error.logs
 */
function logErrorToFile({ statusCode, method, url, reason, details, stack }) {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  let entry = `[${timestamp}] [STATUS ${statusCode || 500}] ${method || 'GET'} ${url || '/'}\n`;
  if (reason) {
    entry += `  Reason : ${reason}\n`;
  }
  if (details) {
    entry += `  Details: ${details}\n`;
  }
  if (stack) {
    const formattedStack = stack
      .split('\n')
      .slice(0, 4)
      .map(line => line.trim())
      .join('\n           ');
    entry += `  Stack  : ${formattedStack}\n`;
  }
  entry += '--------------------------------------------------------------------------------\n';

  fs.appendFile(errorLogPath, entry, (err) => {
    if (err) {
      console.error('[FileLogger] Error writing to error.logs:', err.message);
    }
  });
}

/**
 * Append general access log to logs/combined.logs
 */
function logRequestToFile({ statusCode, method, url, durationMs }) {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const entry = `[${timestamp}] ${method} ${url} ${statusCode} - ${durationMs}ms\n`;

  fs.appendFile(allLogPath, entry, () => {});
}

module.exports = {
  logsDir,
  errorLogPath,
  allLogPath,
  logErrorToFile,
  logRequestToFile
};

