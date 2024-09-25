const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysqlConnection');

const Review = sequelize.define('Review', {
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
    subject: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true, 
    tableName: 'reviews' 
});

module.exports = Review;

