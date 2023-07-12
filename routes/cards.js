const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  deleteLikeCard,
} = require('../controllers/cards');

// роут создания новой карточки
router.post('/',
celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?([\w\W\S]{1,})#?/i),
    // другой вариант: /(https?:\/\/)(w{3}\.)?([a-zA-Z0-9]{1,})#?/
  }),
}),
createCard);
// роут запроса карточек
router.get('/', getCards);
// роут запроса пользователя по id
router.delete('/:id', deleteCard);
// роут лайка карточки
router.put('/:id/likes', likeCard);
// роут удаления лайка карточки
router.delete('/:id/likes', deleteLikeCard);

// экспорт
module.exports = router;
