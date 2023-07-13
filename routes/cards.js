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
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/),
    }),
  }),
  createCard,
);
// роут запроса карточек
router.get('/', getCards);
// роут запроса пользователя по id
router.delete(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
  }),
  deleteCard,
);
// роут лайка карточки
router.put(
  '/:id/likes',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
  }),
  likeCard,
);
// роут удаления лайка карточки
router.delete(
  '/:id/likes',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
  }),
  deleteLikeCard,
);

// экспорт
module.exports = router;
