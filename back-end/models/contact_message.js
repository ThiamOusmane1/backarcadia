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
    replyDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'reply_date'
    },
    repliedBy: {
      type: DataTypes.STRING(24),
      allowNull: true,
      field: 'replied_by'
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


