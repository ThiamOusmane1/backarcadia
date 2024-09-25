require('dotenv').config(); // Pour charger les variables d'environnement depuis un fichier .env
const { Sequelize } = require('sequelize');

// Initialiser Sequelize avec les variables d'environnement
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql'
});

// Tester la connexion à la base de données
sequelize.authenticate()
    .then(() => {
        console.log('Connexion à MySQL réussie.');
    })
    .catch(err => {
        console.error('Impossible de se connecter à MySQL :', err);
    });
