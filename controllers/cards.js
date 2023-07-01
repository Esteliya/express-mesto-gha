const mongoose = require('mongoose');
const Card = require('../models/card');

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
  console.log(id);
  Card.findByIdAndRemove(id)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }
      res.send({ message: 'Карточка успешно удалена' });
    })
    .catch((err) => {
      res.status(500).send(err.message);
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
      res.status(500).send(err.message);
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
      res.status(500).send(err.message);
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
