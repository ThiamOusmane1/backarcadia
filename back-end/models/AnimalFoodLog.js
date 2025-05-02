const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('AnimalFoodLog', {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      defaultValue: () => require('uuid').v4()
    },
    nourriture: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantite: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false
    },
    animalId: {
      type: DataTypes.STRING(24),
      allowNull: false
    },
    employeeId: {
      type: DataTypes.STRING(24),
      allowNull: false
    }
  }, {
    tableName: 'animal_food_logs',
    timestamps: false
  });
};