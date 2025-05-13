const fs = require('fs');
const path = require('path');
const dataFile = path.join(__dirname, '../data/books.json');

const readData = () => {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeData = (data) => {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};

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

exports.findAll = () => readData();

exports.findById = (id) => {
  const books = readData();
  return books.find(b => b.id === id);
};

exports.create = (book) => {
  const books = readData();
  book.id = Date.now().toString();
  books.push(processData(book));
  writeData(books);
  return book;
};

exports.update = (id, newBookData) => {
  const books = readData();
  const index = books.findIndex(b => b.id === id);
  if (index === -1) throw new Error("Книга не знайдена");
  books[index] = processData(Object.assign(books[index], newBookData));
  writeData(books);
  return books[index];
};

exports.delete = (id) => {
  const books = readData();
  const updatedBooks = books.filter(b => b.id !== id);
  writeData(updatedBooks);
};
