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
const port = process.env.PORT || 3002; // Utiliser le port défini par l'environnement
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret'; // Secret pour JWT

// Configuration CORS pour permettre les requêtes du frontend
app.use(cors({
    origin: [
        'https://backarcadia.vercel.app',
        'https://backarcadia-git-main-thiamousmane1s-projects.vercel.app',
        'https://backarcadia-rh95udm9j-thiamousmane1s-projects.vercel.app'
    ],
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

// Routes
app.get('/', (req, res) => res.send('Bienvenue sur l\'API Zoo Arcadia !'));
// Ajoutez ici les autres routes comme celles pour /api/animal-details, /api/update-counter, etc.

// Routeurs pour les différentes API
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

// Routes protégées avec authentification JWT
app.get('/api/protected-route', authenticateToken, (req, res) => {
    res.json({ message: 'Accès autorisé', user: req.user });
});

app.get('/api/admin-dashboard', authenticateToken, authorizeRole('admin'), (req, res) => {
    res.json({ message: 'Bienvenue sur le tableau de bord admin' });
});

// Exporter l'application Express
module.exports = app;
