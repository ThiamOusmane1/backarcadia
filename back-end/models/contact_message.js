// models/contact_messages.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('ContactMessage', {
        id: {
            type: DataTypes.STRING(24),
            primaryKey: true,
            allowNull: false
        },
        email: {
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
        reply: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        reply_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        replied_by: {
            type: DataTypes.STRING(24),
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'contact_messages',
        timestamps: false
    });
};

