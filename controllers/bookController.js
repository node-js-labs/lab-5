const bookService = require('../services/bookService');

const checkAdmin = (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        res.status(403).send('Доступ заборонено');
        return false;
    }
    return true;
};


exports.adminDashboard = async (req, res) => {
    if (!checkAdmin(req, res)) return;
    try {
        const books = await bookService.getAllBooks();
        let bookToEdit = null;
        if (req.query.edit) {
            bookToEdit = await bookService.getBookById(req.query.edit);
            // Перетворюємо keywords в масив, якщо це рядок
            if (bookToEdit && typeof bookToEdit.keywords === 'string') {
                bookToEdit.keywords = bookToEdit.keywords.split(',').map(keyword => keyword.trim());
            }
        }
        res.render('admin', { books, bookToEdit, title: "Адміністративна панель" });
    } catch (err) {
        res.status(500).send('Помилка завантаження панелі адміністратора');
    }
};

exports.createBook = async (req, res) => {
    if (!checkAdmin(req, res)) return;
    try {
        await bookService.createBook(req.body, req.session.user.id);
        res.redirect('/books/admin');
    } catch (err) {
        res.status(500).send('Помилка додавання книги');
    }
};

exports.updateBook = async (req, res) => {
    if (!checkAdmin(req, res)) return;
    try {
        await bookService.updateBook(req.params.id, req.body);
        res.redirect('/books/admin');
    } catch (err) {
        res.status(500).send('Помилка оновлення книги');
    }
};

exports.deleteBook = async (req, res) => {
    if (!checkAdmin(req, res)) return;
    try {
        await bookService.deleteBook(req.params.id);
        res.redirect('/books/admin');
    } catch (err) {
        res.status(500).send('Помилка видалення книги');
    }
};

exports.searchBooks = async (req, res) => {
    const query = req.query.q;
    try {
        const books = await bookService.searchBooks(query);
        res.render('search', { books, query, title: "Пошук книги" });
    } catch (err) {
        res.status(500).send('Помилка пошуку книг');
    }
};

exports.listBooks = async (req, res) => {
    try {
        const books = await bookService.getAllBooks();
        res.render('books', { books, title: "Список книг" });
    } catch (err) {
        res.status(500).send('Помилка завантаження списку книг');
    }
};

exports.bookDetails = async (req, res) => {
    try {
        const book = await bookService.getBookById(req.params.id);
        if (!book) {
            res.status(404).send('Книгу не знайдено');
        } else {
            if (book && typeof book.keywords === 'string') {
                book.keywords = book.keywords.split(',').map(keyword => keyword.trim());
            }
            res.render('book', { book, title: book.title });
        }
    } catch (err) {
        res.status(500).send('Помилка завантаження деталей книги');
    }
};
