// You might switch between implementations by configuration.
const bookRepo = require('../repositories/bookRepoSql');

exports.getAllBooks = async () => {
  return bookRepo.findAll();
};

exports.searchBooks = async (query) => {
  return bookRepo.search(query);
};

exports.createBook = async (bookData, userId) => {
  return bookRepo.create(bookData, userId);
};

exports.getBookById = async (id) => {
  return bookRepo.findById(id);
};

exports.updateBook = async (id, bookData, userId) => {
  return bookRepo.update(id, bookData, userId);
};

exports.deleteBook = async (id, userId) => {
  return bookRepo.delete(id, userId);
};
