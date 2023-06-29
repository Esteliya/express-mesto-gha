const Card = require('../models/card');

// создаем карточку
const createCard = (req, res) => {
  console.log(req.body);

  const { name, link } = req.body;

  const owner = req.user._id;// id пользователя

  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      res.status(500).send(err);
    })
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
    })
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
    })
}

module.exports = {
  createCard,
  getCards,
  deleteCard
};