require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// 🔒 Middleware d'authentification (vérifie la présence et la validité du JWT)
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token non fourni ou mal formé' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Ex: { id, email, role }
        next();
    } catch (error) {
        console.error('Erreur de vérification du token JWT :', error);
        return res.status(403).json({ message: 'Token invalide ou expiré' });
    }
}

// 🔐 Middleware d'autorisation (vérifie le rôle)
function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Accès interdit : rôle insuffisant' });
        }
        next();
    };
}

module.exports = { authenticateToken, authorizeRoles };


