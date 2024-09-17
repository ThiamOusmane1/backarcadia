require('dotenv').config();
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/connection');

// Import des modèles pour s'assurer qu'ils sont enregistrés
require('./models/habitats');
const Animal = require('./models/animals');
const User = require('./models/user');

// Import des routeurs
const animalRouter = require('./routes/animals');
const habitatRouter = require('./routes/habitats');
const reviewRouter = require('./routes/reviewRoute'); 
const authRoutes = require('./routes/auth');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret'; // Secret pour JWT

// Configuration CORS pour permettre les requêtes du frontend
app.use(cors({
    origin: 'http://127.0.0.1:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    credentials: true
}));

// Middleware pour parser le body des requêtes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir les fichiers statiques du répertoire 'front-end' (images, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, '../front-end')));

// Servir les images depuis le répertoire 'front-end/pictures'
app.use('/pictures', express.static(path.join(__dirname, '../front-end/pictures')));

// Route de base pour la racine
app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API Zoo Arcadia !');
});

// Toutes les autres routes (animaux, habitats, reviews, etc.)
app.use('/api/animals', animalRouter);
app.use('/api/habitats', habitatRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/auth', authRoutes.router);

// Middleware pour vérifier le token JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Récupère le token

    if (!token) {
        return res.status(401).json({ message: 'Token manquant' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalide' });
        }
        req.user = user; // Stocker les infos du token décrypté (userId, role)
        next();
    });
};

// Middleware d'autorisation des rôles
const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        const { role } = req.user;
        if (allowedRoles.includes(role)) {
            next(); // Passe à la route suivante si le rôle est autorisé
        } else {
            res.status(403).json({ message: 'Accès refusé.' });
        }
    };
};

// Exemple de route protégée avec rôle spécifique
app.get('/api/admin-dashboard', authenticateToken, authorizeRole('admin'), (req, res) => {
    res.json({ message: 'Bienvenue sur le tableau de bord admin' });
});

// Connecte-toi à MongoDB avant d'exécuter l'application
const startServer = async () => {
    try {
        await connectDB();
        console.log('Base de données connectée avec succès !');
    } catch (err) {
        console.error('Erreur lors de la connexion à la base de données:', err);
    }
};

startServer();

// Exporter l'application pour Vercel
module.exports = app;




