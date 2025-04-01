// middleware/checkRole.js
module.exports = (...roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(403).json({ error: true, message: 'Utilisateur non authentifié' });
      }
  
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: true, message: 'Accès refusé : rôle insuffisant' });
      }
  
      next();
    };
  };
  