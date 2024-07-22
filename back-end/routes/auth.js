// routes/auth.js
const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

// Clé secrète pour les JWT
const JWT_SECRET = 'votre_clé_secrète_pour_jwt';

// Route de connexion
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect' });

        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });

    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
});

// Middleware d'authentification
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token manquant' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token invalide' });
        req.user = user;
        next();
    });
}

// Middleware pour vérifier les rôles
function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Accès interdit' });
        next();
    };
}

module.exports = { router, authenticateToken, authorizeRoles };
