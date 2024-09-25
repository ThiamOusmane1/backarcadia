// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const MySQLUser = require('./models/user'); // Importation du modèle utilisateur MySQL

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

// Route de connexion
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Rechercher l'utilisateur dans la base de données MySQL
        const user = await MySQLUser.findOne({ where: { email } });
        if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé' });

        // Comparer le mot de passe fourni avec celui stocké dans la base de données
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect' });

        // Créer le token JWT
        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Erreur lors de la connexion :', error.message);
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
});

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token manquant' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token invalide' });
        req.user = user; // Stocker les informations du token décrypté (userId, role)
        next();
    });
};

// Middleware pour vérifier les rôles
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Accès interdit' });
        }
        next();
    };
};

// Route protégée pour récupérer le rôle de l'utilisateur
router.get('/getUserRole', authenticateToken, (req, res) => {
    const { role } = req.user;
    res.json({ role });
});

module.exports = { router, authenticateToken, authorizeRoles };
