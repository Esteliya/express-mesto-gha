const mongoose = require('mongoose');
const User = require('../models/user');

// создаем пользователя
const createUser = (req, res) => {
  console.log(req.body);

  const { name, about, avatar } = req.body;
  // проверяем, заполнены ли поля создания пользователя
  if (!name || !about || !avatar) {
    res.status(400).send({ message: 'Обязательные поля не заполнены' });
    return;
  }
  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Невалидные данные' });
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
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Ползователь не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
};

// обновляем данные пользователя
const updateUser = (req, res) => {
  const id = req.user._id;
  const { name, about } = req.body;
  console.log(id);// ловит нужный id

  User.findByIdAndUpdate(id, { name, about }, { new: true })
    .then(( {name, about} ) => {
      if (!name || !about) {
        res.status(400).send({ message: 'Невалидные данные' });
      } else{
        res.send(`Обновленные данные: ${ name } ${ about }`);
      };
    })
    .catch((err) => {
      res.status(500).send(err.message);
    })
}

// обновляем аватар пользователя
const updateAvatar = (req, res) => {
  const id = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(id, { avatar }, { new: true })
    .then(({avatar}) => {
      if (!avatar) {
        res.status(400).send({ message: 'Невалидные данные' });
      } else{
        res.send(`Обновили аватар: ${ avatar }`);
      };
    })
    .catch((err) => {
      res.status(500).send(err.message);
    })
}

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
};