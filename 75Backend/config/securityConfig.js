// 75Backend/config/securityConfig.js

const isProduction = process.env.NODE_ENV === "production";

const securityConfig = {
  // ─── CORS: Only your domains ───
  allowedOrigins: [
    "https://www.75techstore.com.ng",
    "https://75techstore.com.ng",
    ...(isProduction ? [] : ["http://localhost:5173", "http://localhost:3000"]),
  ],

  // ─── Rate Limits ───
  rateLimits: {
    global:     { windowMs: 15 * 60 * 1000, max: 100 },   // 100 req / 15 min
    auth:       { windowMs: 15 * 60 * 1000, max: 5 },      // 5 logins / 15 min
    payment:    { windowMs: 10 * 60 * 1000, max: 8 },      // 8 payments / 10 min
    chatbot:    { windowMs: 5 * 60 * 1000,  max: 15 },     // 15 msgs / 5 min
    admin:      { windowMs: 15 * 60 * 1000, max: 30 },     // 30 admin / 15 min
    api:        { windowMs: 1 * 60 * 1000,  max: 60 },     // 60 API / 1 min
    upload:     { windowMs: 60 * 60 * 1000, max: 20 },     // 20 uploads / 1 hr
  },

  // ─── Payload Size Limits ───
  bodyLimit: "5mb",
  uploadLimit: "10mb",

  // ─── JWT ───
  jwtExpiry: "24h",
  jwtRefreshExpiry: "7d",

  // ─── Password Policy ───
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: true,
  },

  // ─── Blocked Attack Patterns ───
  blockedPatterns: [
    /union\s+select/i,
    /drop\s+table/i,
    /insert\s+into/i,
    /delete\s+from/i,
    /update\s+.*\s+set/i,
    /<script[\s>]/i,
    /<\/script>/i,
    /javascript\s*:/i,
    /on\w+\s*=/i,
    /eval\s*\(/i,
    /document\.cookie/i,
    /window\.location/i,
    /\.exec\s*\(/i,
    /\.spawn\s*\(/i,
    /child_process/i,
    /require\s*\(\s*['"]fs['"]\s*\)/i,
    /\.\.\//g,
    /\.\.\\/g,
    /\/etc\/passwd/i,
    /\/etc\/shadow/i,
    /cmd\.exe/i,
    /powershell/i,
    /wget\s/i,
    /curl\s/i,
    /\$gt/i,
    /\$ne/i,
    /\$regex/i,
    /\$where/i,
    /\$exists/i,
  ],

  // ─── Blocked Paths (WordPress/PHP scanners) ───
  blockedPaths: [
    "/wp-admin", "/wp-login", "/wp-content", "/wp-includes",
    "/.env", "/.git", "/.svn", "/.hg",
    "/phpmyadmin", "/pma", "/myadmin",
    "/admin.php", "/config.php", "/setup.php",
    "/xmlrpc.php", "/install.php",
    "/actuator", "/api/swagger",
    "/.well-known/security.txt",
    "/server-status", "/server-info",
    "/cgi-bin", "/shell", "/cmd",
  ],

  // ─── Suspicious User Agents ───
  blockedUserAgents: [
    /sqlmap/i, /nikto/i, /nmap/i, /masscan/i,
    /dirbuster/i, /gobuster/i, /wfuzz/i,
    /hydra/i, /metasploit/i, /burpsuite/i,
    /zgrab/i, /nuclei/i, /httpx/i,
  ],
};

export default securityConfig;