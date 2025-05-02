const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid'); 

module.exports = (sequelize) => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.STRING(24),
            primaryKey: true,
            allowNull: false, // Doit être unique
            unique: true, // S'assurer que l'ID est unique
            defaultValue: () => uuidv4().replace(/-/g, '').slice(0, 24) // Génère un ID alphanumérique unique sur 24 caractères
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false // champ pour la gestion des mots de passe
        },
        role: {
            type: DataTypes.ENUM('admin', 'vet', 'employee'), // Conserver ENUM pour des valeurs de rôle spécifiques
            allowNull: false,
            defaultValue: 'admin' // Valeur par défaut
        },
        isDeleted: { // Champ pour suppression logique
            type: DataTypes.BOOLEAN,
            defaultValue: false // Par défaut, un utilisateur n'est pas supprimé
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'), // Gestion de l'état de l'utilisateur
            allowNull: true,
            defaultValue: 'active' // Valeur par défaut
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
        }
    }, {
        tableName: 'users',
        timestamps: true, 
    });
};

