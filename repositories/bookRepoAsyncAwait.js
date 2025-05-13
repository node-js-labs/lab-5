const fs = require('fs').promises;
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

const readData = async () => {
  try {
    const data = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeData = async (data) => {
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
};

exports.findAll = async () => {
  return await readData();
};

exports.findById = async (id) => {
  const books = await readData();
  return books.find(b => b.id === id);
};

exports.create = async (book) => {
  const books = await readData();
  book.id = Date.now().toString();
  books.push(processData(book));
  await writeData(books);
  return book;
};

exports.update = async (id, newBookData) => {
  const books = await readData();
  const index = books.findIndex(b => b.id === id);
  if (index === -1) throw new Error("Книга не знайдена");
  books[index] = processData(Object.assign(books[index], newBookData));
  await writeData(books);
  return books[index];
};

exports.delete = async (id) => {
  const books = await readData();
  const updatedBooks = books.filter(b => b.id !== id);
  await writeData(updatedBooks);
};
