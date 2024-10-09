const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/mysqlconnection');

class FoodConsumption extends Model {}

FoodConsumption.init({
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
    sequelize,
    modelName: 'FoodConsumption',
    tableName: 'food_consumption',
    timestamps: false
});

module.exports = FoodConsumption;
