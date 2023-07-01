const User = require('../models/user');

// создаем пользователя
const createUser = (req, res) => {
  console.log(req.body);

  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user)
    })
    .catch((err) => {
      res.status(404).send(err);
    })
};

// запрашиваем список всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users)
    })
    .catch((err) => {
      res.status(500).send(err);
    })
}


// запрашиваем пользователя по id
const getUser = (req, res) => {

  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      res.send({ data: user })
    })
    .catch((err) => {
      res.status(500).send(err);
    })
}

// обновляем данные пользователя
const updateUser = (req, res) => {
  const id = req.user._id;
  const { name, about } = req.body;
  console.log(id);// ловит нужный id

  User.findByIdAndUpdate(id, { name, about }, { new: true })
    .then(({ name, about }) => {
      console.log(`Данные пользователя изменены: имя:${name} о себе: ${about}`);
    })
    .catch((err) => {
      res.status(500).send(err);
    })
}

// обновляем аватар пользователя
const updateAvatar = (req, res) => {
  const id = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(id, { avatar }, { new: true })
    .then((avatar) => {
      console.log(`Аватар пользователя изменен:${avatar}`);
    })
    .catch((err) => {
      res.status(500).send(err);
    })
}

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateAvatar
};