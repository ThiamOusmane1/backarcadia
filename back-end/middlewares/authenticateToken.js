// middleware/authenticateToken.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer token

  if (!token) return res.status(401).json({ error: true, message: 'Token manquant' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: true, message: 'Token invalide' });

    req.user = user; // Contient id et role
    next();
  });
};
