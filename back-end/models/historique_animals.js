const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('HistoriqueAnimal', {
        id: {
            type: DataTypes.STRING(36), // UUID string
            primaryKey: true,
            allowNull: false
        },
        animal_id: {
            type: DataTypes.STRING(24),
            allowNull: false
        },
        vet_id: {
            type: DataTypes.STRING(24),
            allowNull: false
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false
        },
        old_value: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        new_value: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'historique_animals',
        timestamps: false
    });
};


