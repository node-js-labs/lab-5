// You might switch between implementations by configuration.
const bookRepo = require('../repositories/bookRepoSql');

exports.getAllBooks = async () => {
  return bookRepo.findAll();
};

exports.searchBooks = async (query) => {
  return bookRepo.searchBooks(query);
};

exports.createBook = async (bookData, userId) => {
  return bookRepo.create(bookData, userId);
};

exports.getBookById = async (id) => {
  return bookRepo.findById(id);
};

exports.updateBook = async (id, bookData) => {
  return bookRepo.update(id, bookData);
};

exports.deleteBook = async (id) => {
  return bookRepo.delete(id);
};
