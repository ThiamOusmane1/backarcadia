require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { sequelize, connectMySQLDB } = require('./config/mysqlConnection'); // Connexion MySQL avec Sequelize

// Importation des modèles pour MySQL
const Animal = require('./models/animals');
const MySQLUser = require('./models/user');
const Historique = require('./models/historiques');
require('./models/associations');

// Importation des routeurs
const animalRouter = require('./routes/animals');
const habitatRouter = require('./routes/habitats');
const reviewRouter = require('./routes/reviewRoute'); 
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 3000; // Changer à PORT au lieu de DB_PORT pour le serveur
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

// Configuration CORS pour permettre les requêtes du frontend
app.use(cors({
    origin: ['http://127.0.0.1:8080', 'http://localhost:8080'], // Assurez-vous que c'est le bon port pour le frontend
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

        // Synchroniser les modèles avec la base de données
        await sequelize.sync({ alter: true }); // Assurez-vous que vos modèles sont synchronisés

        app.listen(port, () => {
            console.log(`Serveur démarré sur le port ${port}`);
        });
    } catch (error) {
        console.error('Erreur lors du démarrage du serveur :', error);
    }
};

// Routes API
app.use('/api/animals', animalRouter);
app.use('/api/habitats', habitatRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/auth', authRoutes.router);

// Appel de la fonction pour démarrer le serveur
startServer();





