const { Book, Log, sequelize } = require('../models');
const { Op } = require("sequelize")

exports.findAll = () => Book.findAll();
exports.findById = id => Book.findByPk(id);

exports.create = async (bookDTO, userId) => {
  const t = await sequelize.transaction();
  try {
    const book = await Book.create(bookDTO, { transaction: t });

    await Log.create({
      userId,
      action: 'create_book',
      bookTitle: book.title
    }, { transaction: t });

    await t.commit();
    return book;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

exports.update = async (id, bookDTO, userId) => {
  const t = await sequelize.transaction();
  try {
    const book = await Book.findByPk(id, { transaction: t });
    if (!book) throw new Error('Book not found');

    await book.update(bookDTO, { transaction: t });

    await Log.create({
      userId,
      action: 'update_book',
      bookTitle: bookDTO.title ?? book.title
    }, { transaction: t });

    await t.commit();
    return book;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

exports.delete = async (id, userId) => {
  const t = await sequelize.transaction();
  try {
    const book = await Book.findByPk(id, { transaction: t });
    if (!book) throw new Error('Nothing to delete');

    await book.destroy({ transaction: t });

    await Log.create({
      userId,
      bookTitle: book.title,
      action:    'delete_book'
    }, { transaction: t });

    await t.commit();
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

exports.search = q =>
  Book.findAll({
    where: {
      [Op.or]: [
        { title:    { [Op.like]: `%${q}%` } },
        { author:   { [Op.like]: `%${q}%` } },
        { keywords: { [Op.like]: `%${q}%` } }
      ]
    }
  });
