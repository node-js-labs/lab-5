
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title:    { type: DataTypes.STRING, allowNull: false },
    author:   DataTypes.STRING,
    keywords: DataTypes.STRING,
  }, { tableName: 'books', timestamps: false });

  Book.associate = models => {
    Book.hasMany(models.Log, { foreignKey: 'bookId' });
  };

  return Book;
};
