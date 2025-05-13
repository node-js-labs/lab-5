const fs = require('fs');
const path = require('path');
const dataFile = path.join(__dirname, '../data/books.json');

const processData = (data) => {
  if (data === undefined || data === null) throw new Error("Не надано вхідних даних");
  let jsonData = data;
  if (jsonData.keywords) {
    jsonData.keywords = typeof jsonData.keywords === 'string'
      ? jsonData.keywords.split(/\s*,\s*/).map(s => s.trim())
      : Array.isArray(jsonData.keywords)
        ? jsonData.keywords.map(s => typeof s === 'string' ? s.trim() : s)
        : jsonData.keywords;
  }
  return jsonData;
};

exports.findAll = (callback) => {
  fs.readFile(dataFile, 'utf8', (err, data) => {
    if (err) return callback(err, []);
    let books;
    try {
      books = JSON.parse(data);
    } catch (parseErr) {
      return callback(parseErr, []);
    }
    callback(null, books);
  });
};

exports.findById = (id, callback) => {
  exports.findAll((err, books) => {
    if (err) return callback(err);
    const book = books.find(b => b.id === id);
    callback(null, book);
  });
};

exports.create = (book, callback) => {
  exports.findAll((err, books) => {
    if (err) return callback(err);
    book.id = Date.now().toString();
    books.push(processData(book));
    fs.writeFile(dataFile, JSON.stringify(books, null, 2), 'utf8', (err) => {
      if (err) return callback(err);
      callback(null, book);
    });
  });
};

exports.update = (id, newBookData, callback) => {
  exports.findAll((err, books) => {
    if (err) return callback(err);
    const index = books.findIndex(b => b.id === id);
    if (index === -1) return callback(new Error("Книга не знайдена"));
    books[index] = processData(Object.assign(books[index], newBookData));
    fs.writeFile(dataFile, JSON.stringify(books, null, 2), 'utf8', (err) => {
      if (err) return callback(err);
      callback(null, books[index]);
    });
  });
};

exports.delete = (id, callback) => {
  exports.findAll((err, books) => {
    if (err) return callback(err);
    const updatedBooks = books.filter(b => b.id !== id);
    fs.writeFile(dataFile, JSON.stringify(updatedBooks, null, 2), 'utf8', (err) => {
      if (err) return callback(err);
      callback(null);
    });
  });
};
