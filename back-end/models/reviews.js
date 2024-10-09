const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
    return sequelize.define('Review', {
        id: {
            type: DataTypes.INTEGER, // Changez le type à INTEGER
            autoIncrement: true, // Active l'auto-incrémentation
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
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW 
        }
    }, {
        tableName: 'reviews',
        timestamps: true
    });

    return Review;
};





