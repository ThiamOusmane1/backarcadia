require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { sequelize, connectMySQLDB } = require('./config/mysqlConnection'); // Connexion MySQL avec Sequelize

// Importation des modèles pour MySQL
const Animal = require('./models/animals');
const User = require('./models/users');
const HistoriqueAnimal = require('./models/historiques_animals');
const Habitat = require('./models/habitats');
const Review = require('./models/reviews');

// Importation des routeurs
const animalRoutes = require('./routes/animals');
const habitatRoutes = require('./routes/habitats');
const reviewsRoutes = require('./routes/reviews'); 
const authRoutes = require('./routes/auth');
const vetRoutes = require('./routes/vet'); 
const adminRoutes = require('./routes/admin');

const app = express();
const port = process.env.PORT || 3000; 

// Configuration CORS pour permettre les requêtes du frontend
app.use(cors({
    origin: ['http://127.0.0.1:8080', 'https://frontarcadia-app.vercel.app'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    credentials: true
}));

// Middleware pour parser le body des requêtes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir les fichiers statiques du répertoire 'front-end'
app.use(express.static(path.join(__dirname, '../front-end')));
app.use('/pictures', express.static(path.join(__dirname, '../front-end/pictures')));

// Route de base pour la racine
app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API Zoo Arcadia !');
});

// Démarre le serveur et la connexion à la base de données
const startServer = async () => {
    try {
        await connectMySQLDB();
        console.log('Connexion à MySQL réussie.');

        app.listen(port, () => {
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
app.use('/api/auth', authRoutes); // Utilisation de authRoutes.router
app.use('/api', vetRoutes); 
app.use('/api', adminRoutes);

module.exports = app;

