const mongoose = require('mongoose');
const Card = require('../models/card');

// создаем карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;// id пользователя

  // проверяем, заполнены ли поля карточки
  if (!name || !link) {
    res.status(400).send({ message: 'Обязательные поля не заполнены' });
    return;
  }
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    /* .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Невалидные данные' });
      } else {
        res.status(500).send(err.message);
      }
    }); */
    .catch(next)
};

// запрашиваем все карточки
const getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((card) => {
      res.send(card);
    })
    /* .catch((err) => {
      res.status(500).send(err.message);
    }); */
    .catch(next)
};

// удаляем карточку по id
const deleteCard = (req, res, next) => {
  const { id } = req.params;
  Card.findById(id)
  .orFail(() => Error('NotValidId'))
  .then((card) => {
    // карточка пользователя?
    // нет - удаление невозможно
    if (req.user._id !== card.owner.toString()) {
      res.status(403).send({ message: 'У вас нет прав на удалениие данной карточки' });
    } else {
      // если да, то удаляем карточку
      Card.findByIdAndRemove(id)
      .then(() => {
        res.send({ message: 'Карточка успешно удалена' });
      })
    }
  })
  /* .catch((err) => {
    if (err.message === 'NotValidId') {
      res.status(404).send({ message: 'Карточки с таким ID не существует' });
    } else if (err.name === 'CastError') {
      res.status(400).send({ message: 'Введены некорректные данные' });
    } else {
      res.status(500).send(err.message);
    }
  }); */
  .catch(next)
};

// ставим лайк карточке
const likeCard = (req, res, next) => {
  const { id } = req.params;
  const idUser = req.user._id;
  Card.findByIdAndUpdate(id, { $addToSet: { likes: idUser } }, { new: true })
    .orFail(() => Error('NotValidId'))
    .then((card) => {
      res.send(card);
    })
    /* .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Карточки с таким ID не существует' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(500).send(err.message);
      }
    }); */
    .catch(next)
};

// удаляем лайк карточки
const deleteLikeCard = (req, res, next) => {
  const { id } = req.params;
  const idUser = req.user._id;
  Card.findByIdAndUpdate(id, { $pull: { likes: idUser } }, { new: true })
    .orFail(() => Error('NotValidId'))
    .then((card) => {
      res.send(card);
    })
/*     .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Карточки с таким ID не существует' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(500).send(err.message);
      }
    }); */
    .catch(next)
};

// экспорт
module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  deleteLikeCard,
};
