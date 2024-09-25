const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysqlConnection');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true, // si l'email est valide
        },
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'vet', 'employee'),
        allowNull: false,
        defaultValue: 'admin',
    },
}, {
    timestamps: true,
    tableName: 'users', 
});

// Hook pour hacher le mot de passe avant de sauvegarder
User.beforeCreate(async (user, options) => {
    user.password = await bcrypt.hash(user.password, 10);
});

User.beforeUpdate(async (user, options) => {
    if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
});

// Méthode pour comparer les mots de passe
User.prototype.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;


