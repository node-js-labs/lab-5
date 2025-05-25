const fs = require('fs').promises;
const path = require('path');
const dataFile = path.join(__dirname, '../data/users.json');

const readData = () => {
  return fs.readFile(dataFile, 'utf8')
    .then(data => JSON.parse(data))
    .catch(() => []);
};

const processData = (data) => {
  if (data === undefined || data === null) {
    throw new Error("Не надано вхідних даних");
  }

  let jsonData = data;
  if (jsonData.keywords) {
    if (typeof jsonData.keywords === 'string') {
      jsonData.keywords = jsonData.keywords
        .split(/\s*,\s*/)
        .map(keyword => keyword.trim());
    } else if (Array.isArray(jsonData.keywords)) {
      jsonData.keywords = jsonData.keywords.map(keyword =>
        typeof keyword === 'string' ? keyword.trim() : keyword
      );
    }
  }

  return jsonData;
};


const writeData = (data) => {
  return fs.writeFile(dataFile, JSON.stringify(data, null, 2));
};

exports.findAll = () => {
  return readData();
};

exports.findById = (id) => {
  return readData().then(users => users.find(u => u.id === id));
};

exports.create = (user) => {
  return readData().then(users => {
    user.id = Date.now().toString();
    users.push(processData(user));
    return writeData(users).then(() => user);
  });
};

exports.update = async (id, newUserData) => {
  const users = await readData();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) throw new Error('Користувача не знайдено');

  // Якщо поле password порожнє або не передано — не оновлюємо його
  if (!newUserData.password) {
    delete newUserData.password;
  }

  users[index] = processData({ ...users[index], ...newUserData });
  await writeData(users);
  return users[index];
};


exports.delete = (id) => {
  return readData().then(users => {
    const updatedUsers = users.filter(u => u.id !== id);
    return writeData(updatedUsers);
  });
};
