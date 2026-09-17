// 75Backend/middleware/securityLogger.js
import fs from "fs";
import path from "path";

const LOG_DIR = path.join(process.cwd(), "logs");

// Create logs directory if it doesn't exist
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function getLogFilePath() {
  const date = new Date().toISOString().split("T")[0];
  return path.join(LOG_DIR, `security-${date}.log`);
}

function writeLog(level, event, details) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...details,
  };

  const logLine = JSON.stringify(entry) + "\n";

  // Write to file
  fs.appendFileSync(getLogFilePath(), logLine);

  // Also print to console in development
  if (process.env.NODE_ENV !== "production") {
    const icon = level === "CRITICAL" ? "🔴" : level === "WARNING" ? "🟡" : "🟢";
    console.log(`${icon} [${level}] ${event}:`, JSON.stringify(details));
  }
}

export const securityLog = {
  // Critical: Immediate action required
  critical: (event, details) => writeLog("CRITICAL", event, details),

  // Warning: Suspicious but not confirmed
  warning: (event, details) => writeLog("WARNING", event, details),

  // Info: Normal security events
  info: (event, details) => writeLog("INFO", event, details),
};

// ─── Middleware: Log every request ───
export function auditLogger(req, res, next) {
  const start = Date.now();

  // Capture original end method
  const originalEnd = res.end;
  res.end = function (...args) {
    const duration = Date.now() - start;

    // Log suspicious responses
    if (res.statusCode >= 400) {
      securityLog.warning("HTTP_ERROR", {
        ip: req.ip,
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get("User-Agent")?.substring(0, 100),
      });
    }

    // Log all admin actions
    if (req.originalUrl.startsWith("/admin")) {
      securityLog.info("ADMIN_ACCESS", {
        ip: req.ip,
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
      });
    }

    // Log all payment events
    if (req.originalUrl.includes("payment") || req.originalUrl.includes("checkout")) {
      securityLog.info("PAYMENT_EVENT", {
        ip: req.ip,
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
      });
    }

    originalEnd.apply(res, args);
  };

  next();
}

export default securityLog;