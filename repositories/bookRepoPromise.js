const fs = require('fs').promises;
const path = require('path');
const dataFile = path.join(__dirname, '../data/books.json');

const readData = () => {
  return fs.readFile(dataFile, 'utf8')
    .then(data => JSON.parse(data))
    .catch(() => []);
};

const processData = (data) => {
  console.log("HI")
  if (data === undefined || data === null) {
    throw new Error("Не надано вхідних даних");
  }

  let jsonData = data;
  console.log("A")
  if (jsonData.keywords) {
    console.log("A")
    if (typeof jsonData.keywords === 'string') {
      console.log("B")
      jsonData.keywords = jsonData.keywords
        .split(/\s*,\s*/)
        .map(keyword => keyword.trim());
        console.log("B")
    } else if (Array.isArray(jsonData.keywords)) {
      console.log("C")
      jsonData.keywords = jsonData.keywords.map(keyword =>
        typeof keyword === 'string' ? keyword.trim() : keyword
      );
      console.log("C")
    }
  }

  console.log("CD")
  return jsonData;
};


const writeData = (data) => {
  return fs.writeFile(dataFile, JSON.stringify(data, null, 2));
};

exports.findAll = () => {
  return readData();
};

exports.findById = (id) => {
  return readData().then(books => books.find(b => b.id === id));
};

exports.create = (book) => {
  return readData().then(books => {
    book.id = Date.now().toString();
    books.push(processData(book));
    return writeData(books).then(() => book);
  });
};

exports.update = (id, newBookData) => {
  return readData().then(books => {
    const index = books.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Книга не знайдена');
    books[index] = processData({ ...books[index], ...newBookData });
    return writeData(books).then(() => books[index]);
  });
};

exports.delete = (id) => {
  return readData().then(books => {
    const updatedBooks = books.filter(b => b.id !== id);
    return writeData(updatedBooks);
  });
};
