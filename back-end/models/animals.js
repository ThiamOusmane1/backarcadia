// models/animals.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysqlConnection'); 

const Animal = sequelize.define('Animal', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    health: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    food: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    habitatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Habitats', // Nom de la table associée
            key: 'id'
        }
    },
    url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    consultations: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    history: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'animals'
});

module.exports = Animal;
