const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('UserAnimal', {
        id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
            allowNull: false,
        },
        users_id: {
            type: DataTypes.STRING(24),
            allowNull: false,
        },
        animal_id: {
            type: DataTypes.STRING(24),
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('vet', 'admin'),
            allowNull: false,
        },
    }, {
        tableName: 'users_animals',
        timestamps: false,
    });
};
