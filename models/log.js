// models/log.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define(
    'Log',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false
      },
      bookTitle: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'book_title'
      }
    },
    {
      tableName: 'logs',
      timestamps: false
    }
  );
  
  Log.associate = models => {
    Log.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Log;
};
