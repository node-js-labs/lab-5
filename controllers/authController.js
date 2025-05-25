const authService = require('../services/authService');

// показати форму реєстрації
exports.showRegister = (req, res) => {
    res.render('register', { title: "Реєстрація" });
};

// обробити реєстрацію
exports.register = async (req, res) => {
    try {
        const newUser = await authService.createUser(req.body);
        // await authService.createUser(req.body);
        req.session.user = newUser; // автоматичний вхід після реєстрації
        res.redirect('/profile');
    } catch (err) {
        res.render('register', { title: "Реєстрація", error: 'Помилка реєстрації користувача; Може логін зайнятий?' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.session.user.id; // Беремо id з сесії
        // Оновити дані в сесії після оновлення
        req.session.user = await authService.updateUser(userId, req.body);

        res.redirect('/profile');
    } catch (err) {
        res.status(500).send('Помилка оновлення профілю');
    }
};


// показати форму входу
exports.showLogin = (req, res) => {
    res.render('login', { title: "Вхід" });
};

// обробити вхід
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await authService.findByUsername(username);

        if (user && user.password === password) {
            req.session.user = {
                id: user.id,
                username: user.username,
                role: user.role,
                surname: user.surname,
                name: user.name
            };
            res.redirect('/profile');
        } else {
            res.render('login', { title: "Вхід", error: "Невірний логін або пароль" });
        }
    } catch (err) {
        res.status(500).send('Помилка входу користувача');
    }
};

// показати профіль користувача
exports.profile = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('profile', { user: req.session.user, title: "Профіль" });
};

// обробити вихід
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/profile');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
};
