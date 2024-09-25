const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysqlConnection');
const Animal = require('./animals');
const User = require('./user');  

const Historique = sequelize.define('Historique', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    animal_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Animal, // Lien avec le modèle Animal
            key: 'id'
        }
    },
    vet_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Lien avec le modèle User (si c'est un vétérinaire)
            key: 'id'
        }
    }
}, {
    timestamps: true, // Sequelize va automatiquement gérer createdAt et updatedAt
    tableName: 'historiques'
});

// Définir les relations si nécessaire
Historique.belongsTo(Animal, { foreignKey: 'animal_id', as: 'animal' });
Historique.belongsTo(User, { foreignKey: 'vet_id', as: 'veterinaire' });

module.exports = Historique;

