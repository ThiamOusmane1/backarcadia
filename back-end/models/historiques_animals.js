const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('HistoriqueAnimal', {
        id: {
            type: DataTypes.STRING(24),
            primaryKey: true,
            allowNull: false
        },
        animal_id: {
            type: DataTypes.STRING(24),
            allowNull: false
        },
        description: {
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
