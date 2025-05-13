const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// реєстрація
router.get('/register', authController.showRegister);
router.post('/register', authController.register);

// вхід
router.get('/login', authController.showLogin);
router.post('/login', authController.login);

// профіль
router.get('/profile', authController.profile);
router.post('/profile/update', authController.updateProfile);

// вихід
router.get('/logout', authController.logout);

module.exports = router;
