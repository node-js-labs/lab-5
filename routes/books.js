const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.get('/admin', bookController.adminDashboard);
router.post('/admin/create', bookController.createBook);
router.post('/admin/edit/:id', bookController.updateBook);
router.post('/admin/delete/:id', bookController.deleteBook);

router.get('/', bookController.listBooks);
router.get('/search', bookController.searchBooks);
router.get('/:id', bookController.bookDetails);

module.exports = router;
