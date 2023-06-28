const router = require('express').Router();
const { createCard, getCards, deleteCard } = require('../controllers/cards');

//роут создания новой карточки
router.post("/", createCard);
//роут запроса карточек
router.get("/", getCards);
//роут запроса пользователя по id
router.delete("/:id", deleteCard);


module.exports = router;
