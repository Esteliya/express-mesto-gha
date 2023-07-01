const mongoose = require('mongoose');
const Card = require('../models/card');

// создаем карточку
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;// id пользователя

  // проверяем, заполнены ли поля карточки
  if (!name || !link) {
    res.status(400).send({ message: 'Обязательные поля не заполнены' });
    return;
  }
  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Невалидные данные' });
      } else {
        res.status(500).send(err.message);
      }
    });
};

// запрашиваем все карточки
const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
};

// удаляем карточку по id
const deleteCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndRemove(id)
    .then((card) => {
      if (!card) {
        res.status(400).send({ message: 'Карточка не найдена' });
        return;
      }
      res.send({ message: 'Карточка успешно удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(500).send(err.message);
      }
    });
};

// ставим лайк карточке
const likeCard = (req, res) => {
  const { id } = req.params;
  const idUser = req.user._id;
  Card.findByIdAndUpdate(id, { $addToSet: { likes: idUser } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточки с таким ID не существует' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(500).send(err.message);
      }
    });
};

// удаляем лайк карточки
const deleteLikeCard = (req, res) => {
  const { id } = req.params;
  const idUser = req.user._id;
  Card.findByIdAndUpdate(id, { $pull: { likes: idUser } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточки с таким ID не существует' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(500).send(err.message);
      }
    });
};

// экспорт
module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  deleteLikeCard,
};
