const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.STRING(24),
            primaryKey: true,
            allowNull: false, // Doit être unique
            unique: true // S'assurer que l'ID est unique
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false // Conserver le champ pour la gestion des mots de passe
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
            defaultValue: 0 // Champ de version, si nécessaire
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false // Indiquer que ce champ doit être renseigné
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false // Indiquer que ce champ doit être renseigné
        }
    }, {
        tableName: 'users',
        timestamps: true, // Activer les timestamps pour createdAt et updatedAt
    });
};

