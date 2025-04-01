// models/food_consumption.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('FoodConsumption', {
        id: {
            type: DataTypes.STRING(24),
            primaryKey: true,
            allowNull: false
        },
        animal_id: {
            type: DataTypes.STRING(24),
            allowNull: false
        },
        employee_id: {
            type: DataTypes.STRING(24),
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        nourriture: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        quantite: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        }
    }, {
        tableName: 'food_consumption',
        timestamps: false
    });
};


