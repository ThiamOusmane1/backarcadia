require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../config/mysqlConnection'); // Modèle utilisateur

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

// Route de connexion
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Log des informations reçues dans la requête
    console.log('Requête de connexion reçue avec les informations suivantes :', { email, password });

    try {
        // Recherche de l'utilisateur par e-mail
        const user = await User.findOne({ where: { email } });
        console.log('Utilisateur trouvé :', user);

        if (!user) {
            console.log('Utilisateur non trouvé pour l\'email :', email);
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérification du mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Résultat de la comparaison des mots de passe :', isMatch);

        if (!isMatch) {
            console.log('Mot de passe incorrect pour l\'utilisateur :', email);
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        // Génération du token
        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
        console.log('Token généré :', token);

        // Renvoi du token au client
        res.json({ token });
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
});

// Middleware pour vérifier le token JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token manquant' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token invalide' });
        req.user = user;
        next();
    });
};

// Middleware pour vérifier le rôle utilisateur
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Accès interdit' });
        }
        next();
    };
};

// Route pour récupérer le rôle de l'utilisateur authentifié
router.get('/getUserRole', authenticateToken, (req, res) => {
    // Récupérer le rôle de l'utilisateur depuis le token
    const userRole = req.user.role;

    if (!userRole) {
        return res.status(404).json({ message: 'Rôle non trouvé' });
    }

    // Répondre avec le rôle de l'utilisateur
    res.json({ role: userRole });
});

module.exports = router;


