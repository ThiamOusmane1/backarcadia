// config/mysqlConnection.js
require('dotenv').config(); // Charge les variables d'environnement depuis un fichier .env
const { Sequelize } = require('sequelize');

// Connexion à la base de données
const sequelize = new Sequelize(
    process.env.DB_NAME,      // Nom de la base de données
    process.env.DB_USER,     // Nom d'utilisateur de la base de données
    process.env.DB_PASSWORD,  // Mot de passe de la base de données
    {
        host: process.env.DB_HOST || 'localhost', // Hôte de la base de données
        dialect: 'mysql',                          // Type de base de données
        port: process.env.DB_PORT || 3306         // Port de connexion
    }
);

// Importation des modèles
const Animal = require('../models/animals')(sequelize);
const Habitat = require('../models/habitats')(sequelize);
const HistoriqueAnimal = require('../models/historiques_animals')(sequelize);
const User = require('../models/users')(sequelize);
const Review = require('../models/reviews')(sequelize);

// Afficher les modèles initialisés pour le débogage
console.log('Modèle User initialisé :', User);
console.log('Modèle Review initialisé :', Review);

// Définir les associations entre les modèles
Animal.belongsTo(Habitat, { foreignKey: 'habitat_id', as: 'habitat' });
Habitat.hasMany(Animal, { foreignKey: 'habitat_id', as: 'animaux' });
Animal.hasMany(HistoriqueAnimal, { foreignKey: 'animal_id', as: 'historique' });
HistoriqueAnimal.belongsTo(Animal, { foreignKey: 'animal_id', as: 'animal' });

// Fonction de connexion à la base de données
const connectMySQLDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion à la base de données réussie.');
    } catch (error) {
        console.error('Impossible de se connecter à la base de données:', error);
    }
};

// Exporter les objets nécessaires
module.exports = {
    sequelize,
    Animal,
    Habitat,
    HistoriqueAnimal,
    User,
    Review,
    connectMySQLDB 
};
