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
    try {
        user.password = await bcrypt.hash(user.password, 10);
    } catch (error) {
        throw new Error('Erreur lors du hachage du mot de passe');
    }
});

User.beforeUpdate(async (user, options) => {
    try {
        if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, 10);
        }
    } catch (error) {
        throw new Error('Erreur lors du hachage du mot de passe');
    }
});

// Méthode pour comparer les mots de passe
User.prototype.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Erreur lors de la comparaison des mots de passe');
    }
};


module.exports = User;


