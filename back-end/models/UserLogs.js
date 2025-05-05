const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('UserLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.STRING(36),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'employee', 'vet'),
      allowNull: false
    },
    action_type: {
      type: DataTypes.ENUM('ajout', 'modification', 'suppression'),
      allowNull: false
    },
    target_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    target_id: {
      type: DataTypes.STRING(36),
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'user_logs',
    timestamps: false
  });
};

