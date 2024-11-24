require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { sequelize, connectMySQLDB } = require('./config/mysqlConnection');

// Importation des modèles et routeurs
const animalRoutes = require('./routes/animals');
const habitatRoutes = require('./routes/habitats');
const reviewsRoutes = require('./routes/reviews'); 
const authRoutes = require('./routes/auth');
const vetRoutes = require('./routes/vet'); 
const adminRoutes = require('./routes/admin');

const app = express();
const port = process.env.PORT || 3000;

// Configuration CORS stricte
app.use(cors({
    origin: ['http://127.0.0.1:8080', 'https://front-arcadia.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    credentials: true
}));

// Middleware pour parser le body des requêtes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../front-end')));
app.use('/pictures', express.static(path.join(__dirname, '../front-end/pictures')));

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: true,
        message: 'Erreur interne du serveur',
        details: err.message
    });
});

// Route de base
app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API Zoo Arcadia !');
});

// Lancer le serveur et connecter MySQL
const startServer = async () => {
    try {
        await connectMySQLDB();
        console.log('Connexion à MySQL réussie.');

        await sequelize.sync();
        console.log('Base de données synchronisée.');

        app.listen(port, '0.0.0.0', () => {
            console.log(`Serveur démarré sur le port ${port}`);
        });
    } catch (error) {
        console.error('Erreur lors du démarrage du serveur :', error);
    }
};

// Routes API
app.use('/api/animals', animalRoutes);
app.use('/api/habitats', habitatRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api', vetRoutes); 
app.use('/api', adminRoutes);

startServer();

module.exports = app;
