
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name:     DataTypes.STRING,
    surname:  DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user'
    }
  }, { tableName: 'users', timestamps: false });

  User.associate = models => {
    User.hasMany(models.Log, { foreignKey: 'userId' });
  };

  return User;
};
