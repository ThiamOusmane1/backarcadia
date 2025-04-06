require('dotenv').config();
const { Sequelize } = require('sequelize');

// Initialisation de Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306,
        logging: false, // Désactive les logs SQL pour la prod (mettre true pour debug)
    }
);

// Import des modèles
const Animal = require('../models/animals')(sequelize);
const Habitat = require('../models/habitats')(sequelize);
const HistoriqueAnimal = require('../models/historique_animals')(sequelize);
const User = require('../models/users')(sequelize);
const Review = require('../models/reviews')(sequelize);
const UserAnimal = require('../models/users_animals')(sequelize);
const FoodConsumption = require('../models/food_consumption')(sequelize);
const ContactMessage = require('../models/contact_message')(sequelize);
const FoodStock = require('../models/FoodStock')(sequelize); 

// Définition des associations

// Habitat ➜ Animaux
Habitat.hasMany(Animal, { foreignKey: 'habitat_id', as: 'animaux' });
Animal.belongsTo(Habitat, { foreignKey: 'habitat_id', as: 'habitat' });

// Animal ➜ Historique
Animal.hasMany(HistoriqueAnimal, { foreignKey: 'animal_id', as: 'historique' });
HistoriqueAnimal.belongsTo(Animal, { foreignKey: 'animal_id', as: 'animal' });

// Vétérinaire (User) ➜ Animaux soignés
User.hasMany(Animal, { foreignKey: 'vet_id', as: 'animaux_soignes' });
Animal.belongsTo(User, { foreignKey: 'vet_id', as: 'veterinaire' });

// User ➜ Avis
//User.hasMany(Review, { foreignKey: 'user_id', as: 'avis' });
//Review.belongsTo(User, { foreignKey: 'user_id', as: 'utilisateur' });

// User ⬌ Animal via users_animals
User.belongsToMany(Animal, {
    through: UserAnimal,
    foreignKey: 'users_id',
    otherKey: 'animal_id',
    as: 'animaux_gérés'
});
Animal.belongsToMany(User, {
    through: UserAnimal,
    foreignKey: 'animal_id',
    otherKey: 'users_id',
    as: 'soigneurs'
});

ContactMessage.belongsTo(User, {
    foreignKey: 'replied_by',
    as: 'repondeur'
});
User.hasMany(ContactMessage, {
    foreignKey: 'replied_by',
    as: 'messages_repondus'
});


// Employee ➜ FoodConsumption
User.hasMany(FoodConsumption, { foreignKey: 'employee_id', as: 'consommations' });
FoodConsumption.belongsTo(User, { foreignKey: 'employee_id', as: 'employee' });

// Animal ➜ FoodConsumption
Animal.hasMany(FoodConsumption, { foreignKey: 'animal_id', as: 'consommations' });
FoodConsumption.belongsTo(Animal, { foreignKey: 'animal_id', as: 'animal' });


// 🔌 Fonction de connexion
const connectMySQLDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(' Connexion à la base de données MySQL réussie.');
    } catch (error) {
        console.error(' Impossible de se connecter à la base de données :', error);
    }
};

// Exports
module.exports = {
    sequelize,
    connectMySQLDB,
    Animal,
    Habitat,
    HistoriqueAnimal,
    User,
    Review,
    UserAnimal,
    FoodConsumption,
    ContactMessage,
    FoodStock
};
