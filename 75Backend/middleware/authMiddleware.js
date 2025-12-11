import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

// load .env so JWT_SECRET is available

export const protect = (req, res, next ) => {
  try{
    // 1 check for token in Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorizes, no token provided'});
    }

    // 2 Extract the token
    const token = authHeader.split(' ')[1];

    // 3 verify token validity 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4 Attach the decoded user data to request object
    req.user = decoded; // now accessible in next functions

    // Pass control to next piece of middleware / controller 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalid or expired', error: error.message })
  }
};

// optional: only allow admins
export const adminOnly = (req, res, next ) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Acess forbidden: Admins only" })
  }
};