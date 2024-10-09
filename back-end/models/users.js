const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.STRING(24),
            primaryKey: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('admin', 'vet', 'employee'),
            allowNull: false,
            defaultValue: 'admin'
        },
        __v: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            allowNull: true,
            defaultValue: 'active'
        }
    }, {
        tableName: 'users',
        timestamps: false
    });
};
