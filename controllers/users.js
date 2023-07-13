const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// контроллер аутентификации
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .orFail(() => new Error('NotData'))
    // если email существует в базе —> пользователь в переменной user
    .then((user) => {
      // проверяем пароль
      bcrypt.compare(password, user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            // если валидный пароль —> создадим jwt токен на 7 дней
            const token = jwt.sign(
              { _id: user._id },
              // секретный ключ — перенести!!!
              'super-strong-secret',
              // токен на 7 дней
              { expiresIn: '7d' },
            );
            // записываем токен в httpOnly кук —> отправляем на фронт пользователя
            res.status(200).cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true }).send(user);
          } else {
            // res.status(403).send({ message: 'Введены некорректные данные' });
            next(new Error('NotData'));
          }
        });
    })
    .catch(next);
};

// создаем пользователя
const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password
  } = req.body;
  // проверяем, заполнены ли поля создания пользователя
  if (!email || !password) {
    res.status(400).send({ message: 'Обязательные поля не заполнены' });
    return;
  }
  // хэшируем пароль
  bcrypt.hash(password, 10)
    .then(hash => User.create({
      email: email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      res.status(201).send(user);
    })
    .catch(next);
};

// запрашиваем список всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

// заправшиваем авторизированного пользователя
const getAuthUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .orFail(() => Error('NotValidId'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

// запрашиваем пользователя по id
const getUser = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .orFail(() => Error('NotValidId'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

// обновляем данные пользователя
const updateUser = (req, res, next) => {
  const id = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .orFail(() => Error('NotValidId'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

// обновляем аватар пользователя
const updateAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(id, { avatar }, { new: true })
    .orFail(() => Error('NotValidId'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

module.exports = {
  createUser,
  getUsers,
  getAuthUser,
  getUser,
  updateUser,
  updateAvatar,
  login,
};
