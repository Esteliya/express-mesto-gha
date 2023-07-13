const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getUsers,
  getAuthUser,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

// роут запроса всех пользователей
router.get('/', getUsers);
// роут запроса данных пользователя
router.get('/me', getAuthUser);
// роут изменения данных пользователя
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser,
);
// роут запроса пользователя по id
router.get(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
  }),
  getUser,
);
// роут изменения аватара пользователя
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/),
    }),
  }),
  updateAvatar,
);

module.exports = router;
