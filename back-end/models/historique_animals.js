const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('HistoriqueAnimal', {
        id: {
            type: DataTypes.STRING(36), 
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
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        new_value: {
            type: DataTypes.TEXT('long'),
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


