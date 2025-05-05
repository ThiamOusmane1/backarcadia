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
const employeeRoutes = require('./routes/employee');
const contactMessagesRoutes = require('./routes/contact_messages');

const app = express();
const port = process.env.PORT || 3000;

//  Nouvelle configuration CORS 
const corsOptions = {
    origin: true, // Reflète automatiquement l'origine de la requête
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
};
app.use(cors(corsOptions)); 


// Middleware pour parser le body des requêtes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route de base
app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API Zoo Arcadia !');
});

// Routes API
app.use('/api/contact_messages', contactMessagesRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/habitats', habitatRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/vet', vetRoutes); 
app.use('/api/admin', adminRoutes);
app.use('/api/employee', employeeRoutes);


// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: true,
        message: 'Erreur interne du serveur',
        details: err.message
    });
});

// Gestion des erreurs 404 pour les routes non définies
app.use((req, res, next) => {
    res.status(404).json({
        error: true,
        message: 'Route non trouvée'
    });
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

startServer();

module.exports = app;

