const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Animal', {
        id: {
            type: DataTypes.STRING(24),
            primaryKey: true,
            allowNull: false // Doit être unique
        },
        nom: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        habitat_id: {
            type: DataTypes.STRING(24),
            allowNull: true
        },
        sante: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        poids: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        nourriture: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        quantite: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        vet_id: {
            type: DataTypes.STRING(24),
            allowNull: true
        },
        url: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        consultations: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        soins: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        isDeleted: { // Champ pour suppression logique
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'animals',
        timestamps: false
    });
};
