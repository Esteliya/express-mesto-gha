const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// создаем пользователя
const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  // проверяем, заполнены ли поля создания пользователя
  if (!email || !password) {
    res.status(400).send({ message: 'Обязательные поля не заполнены' });
    return;
  }
  //хэшируем пароль
  bcrypt.hash(req.body.password, 10)
    .then(hash => User.create({
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send(err);
      } else {
        res.status(500).send(err.message);
      }
    });
};

// запрашиваем список всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
};

// запрашиваем пользователя по id
const getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .orFail(() => Error('NotValidId'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Ползователь не найден' });
      } else if (err.name === 'CastError') {
        res.status(400).send(err);
      } else {
        res.status(500).send(err);
      }
    });
};

// обновляем данные пользователя
const updateUser = (req, res) => {
  const id = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .orFail(() => Error('NotValidId'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Ползователь не найден' });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(500).send(err.message);
      }
    });
};

// обновляем аватар пользователя
const updateAvatar = (req, res) => {
  const id = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(id, { avatar }, { new: true })
    .orFail(() => Error('NotValidId'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Ползователь не найден' });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(500).send(err.message);
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
};
