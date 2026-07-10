// ========== GLOBAL ERROR HANDLER ==========
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  res.status(status).json({
    message,
    error: process.env.NODE_ENV === 'development' ? err : {},
    timestamp: new Date().toISOString()
  });
};

// ========== 404 NOT FOUND ==========
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`
  });
};

// ========== ASYNC ERROR WRAPPER ==========
// Wrap async functions to catch errors automatically
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};