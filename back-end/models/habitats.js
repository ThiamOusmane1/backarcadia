// models/habitats.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysqlConnection');

const Habitat = sequelize.define('Habitat', {
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
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'habitats'
});

module.exports = Habitat;
