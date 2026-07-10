// ========== VALIDATE REQUEST BODY ==========
export const validateBody = (allowedFields) => {
  return (req, res, next) => {
    const receivedFields = Object.keys(req.body);
    const invalidFields = receivedFields.filter(
      field => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: `Invalid fields: ${invalidFields.join(', ')}`
      });
    }

    next();
  };
};

// ========== VALIDATE REQUIRED FIELDS ==========
export const validateRequiredFields = (fields) => {
  return (req, res, next) => {
    const missingFields = fields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    next();
  };
};

// ========== VALIDATE EMAIL FORMAT ==========
export const validateEmail = (req, res, next) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (req.body.email && !emailRegex.test(req.body.email)) {
    return res.status(400).json({
      message: 'Invalid email format'
    });
  }

  next();
};

// ========== VALIDATE PRICE ==========
export const validatePrice = (req, res, next) => {
  if (req.body.price && (isNaN(req.body.price) || req.body.price < 0)) {
    return res.status(400).json({
      message: 'Price must be a positive number'
    });
  }

  next();
};

// ========== VALIDATE STOCK ==========
export const validateStock = (req, res, next) => {
  if (req.body.stock && (isNaN(req.body.stock) || req.body.stock < 0)) {
    return res.status(400).json({
      message: 'Stock must be a non-negative number'
    });
  }

  next();
};

// ========== VALIDATE ID FORMAT (MongoDB) ==========
export const validateMongoId = (req, res, next) => {
  const id = req.params.id;
  const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

  if (!mongoIdRegex.test(id)) {
    return res.status(400).json({
      message: 'Invalid ID format'
    });
  }

  next();
};

// ========== VALIDATE PAGINATION ==========
export const validatePagination = (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  if (page < 1 || limit < 1) {
    return res.status(400).json({
      message: 'Page and limit must be positive numbers'
    });
  }

  req.pagination = { page, limit };
  next();
};

// ========== VALIDATE ORDER STATUS ==========
export const validateOrderStatus = (req, res, next) => {
  const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const status = req.body.status;

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
    });
  }

  next();
};

// ========== VALIDATE USER ROLE ==========
export const validateRole = (req, res, next) => {
  const validRoles = ['user', 'seller', 'admin'];
  const role = req.body.role;

  if (role && !validRoles.includes(role)) {
    return res.status(400).json({
      message: `Invalid role. Must be one of: ${validRoles.join(', ')}`
    });
  }

  next();
};