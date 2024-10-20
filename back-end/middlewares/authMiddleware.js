require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// Middleware d'authentification
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extraction du token

    // Vérification du token
    if (!token) return res.status(401).json({ message: 'Token manquant' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token invalide' });
        req.user = user;  // Stocker l'utilisateur dans la requête pour les prochaines opérations
        next(); // Passer à l'étape suivante
    });
}

// Middleware d'autorisation basé sur les rôles
function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Accès interdit : rôle insuffisant' });
        }
        next();
    };
}

module.exports = { authenticateToken, authorizeRoles };

