const User = require('../models/user');

//создаем пользователя
const createUser = (req, res) => {
  console.log(req.body);

  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user)
    })
    .catch((err) => {
      res.status(500).send(err);
    })
};

//запрашиваем список всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users)
    })
    .catch((err) => {
      res.status(500).send(err);
    })
}


//запрашиваем пользователя по id
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

module.exports = {
  createUser,
  getUsers,
  getUser
};