// ========== REQUEST LOGGING ==========
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const method = req.method;
  const path = req.path;
  const ip = req.ip;

  // Log when response is sent
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const status = res.statusCode;

    console.log(
      `[${new Date().toISOString()}] ${method} ${path} - Status: ${status} - Duration: ${duration}ms - IP: ${ip}`
    );
  });

  next();
};

// ========== ERROR LOGGING ==========
export const errorLogger = (err, req, res, next) => {
  console.error(
    `[${new Date().toISOString()}] ERROR: ${err.message}`
  );
  console.error(`Path: ${req.path}, Method: ${req.method}`);
  console.error(err.stack);

  next(err);
};

// ========== AUTH LOGGING ==========
export const authLogger = (req, res, next) => {
  if (req.user) {
    console.log(
      `[${new Date().toISOString()}] Authenticated user: ${req.user.id} (${req.user.email})`
    );
  }

  next();
};