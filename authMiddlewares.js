const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const token = req.cookies['json-token'];

  if (!token) {
    return res.status(401).json({msg: 'Access Denied. No token provided'})
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ msg: 'Invalid or Expired Token'})
  }
}

const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access Denied. Admin only'})
  }
}

module.exports = { verifyToken, verifyAdmin }