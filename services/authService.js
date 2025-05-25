const authRepo = require('../repositories/authRepoSql');

exports.getAllUsers = async () => {
  return authRepo.findAll();
};

exports.createUser = async (userData) => {
  return authRepo.create(userData);
};

exports.getUserById = async (id) => {
  return authRepo.findById(id);
};

exports.findByUsername = async (username) => {
  return authRepo.findByUsername(username);
};

exports.updateUser = async (id, userData) => {
  return authRepo.update(id, userData);
};

exports.deleteUser = async (id) => {
  return authRepo.delete(id);
};
