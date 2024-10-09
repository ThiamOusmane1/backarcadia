const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/mysqlconnection');

class ContactMessage extends Model {}

ContactMessage.init({
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
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'ContactMessage',
    tableName: 'contact_messages',
    timestamps: false
});

module.exports = ContactMessage;
