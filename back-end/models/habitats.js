const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Habitat', {
        id: {
            type: DataTypes.STRING(24),
            primaryKey: true,
            allowNull: false
        },
        nom: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'habitats',
        timestamps: false
    });
};


