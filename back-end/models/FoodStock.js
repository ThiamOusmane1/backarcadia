// models/FoodStock.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('FoodStock', {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true
    },
    nourriture: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    quantite_stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    unite: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'kg'
    },
    seuil_alerte: {
      type: DataTypes.INTEGER,
      defaultValue: 5
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'food_stock',
    timestamps: false
  });
};
