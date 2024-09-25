const { Sequelize } = require('sequelize');
require('dotenv').config(); // Charger les variables d'environnement

// Initialisation de Sequelize avec les variables d'environnement
const sequelize = new Sequelize(
  process.env.DB_NAME, // Nom de la base de données
  process.env.DB_USER, // Nom d'utilisateur
  process.env.DB_PASSWORD, // Mot de passe
  {
    host: process.env.DB_HOST || 'localhost', // Hôte
    dialect: 'mysql', // Type de base de données
    port: process.env.DB_PORT || 3306, // Port
  }
);

// Fonction de connexion à la base de données MySQL
const connectMySQLDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à MySQL réussie.');
  } catch (error) {
    console.error('Erreur lors de la connexion à MySQL :', error.message);
    process.exit(1); // Quitter le processus en cas d'erreur
  }
};

// Exportation de sequelize et de la fonction connectMySQLDB
module.exports = { sequelize, connectMySQLDB };
