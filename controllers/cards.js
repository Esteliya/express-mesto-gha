const Card = require('../models/card');
const mongoose = require('mongoose');

// создаем карточку
const createCard = (req, res) => {
  console.log(req.body);
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
        return;
      }
      res.status(500).send(err);
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
      res.status(500).send(err);
    });
};

// удаляем карточку по id
const deleteCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndRemove(id)
    .then((card) => {
      console.log(`Удалили карточку ${card.name} с ID: ${id}`);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

// ставим лайк карточке
const likeCard = (req, res) => {
  const { id } = req.params;
  const idUser = req.user._id;
  console.log(`id: ${id}`);
  console.log(`idUser: ${idUser}`);
  Card.findByIdAndUpdate(id, { $addToSet: { likes: idUser } }, { new: true })
    .then((card) => {
      console.log(`Поставили лайк карточке ${card.name} с ID: ${id}`);
      res.send({ data: card });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

// удаляем лайк карточки
const deleteLikeCard = (req, res) => {
  const { id } = req.params;
  const idUser = req.user._id;
  console.log(`id: ${id}`);
  console.log(`idUser: ${idUser}`);
  Card.findByIdAndUpdate(id, { $pull: { likes: idUser } }, { new: true })
    .then((card) => {
      console.log(`Удалили лайк карточки ${card.name} с ID: ${id}`);
      res.send({ data: card });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

// экспорт
module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  deleteLikeCard
};