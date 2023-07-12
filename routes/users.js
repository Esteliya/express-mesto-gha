const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  //createUser,
  getUsers,
  getAuthUser,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

// роут создания нового пользователя
//router.post('/', createUser);
// роут запроса всех пользователей
router.get('/', getUsers);
// роут изменения данных пользователя
router.get('/me',
celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?([a-zA-Z0-9\S]{1,})#?/),
    // другой вариант: /(https?:\/\/)(w{3}\.)?([\w\W\S]{1,})#?/i
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}),
getAuthUser);
// роут изменения данных пользователя
router.patch('/me',
celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?([a-zA-Z0-9\S]{1,})#?/),
  }),
}),
updateUser);
// роут запроса пользователя по id
router.get('/:id', getUser);
// роут изменения аватара пользователя
router.patch('/me/avatar',
celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?([a-zA-Z0-9\S]{1,})#?/),
    // другой вариант: /(https?:\/\/)(w{3}\.)?([a-zA-Z0-9]{1,})#?/
  }),
}),
updateAvatar);

module.exports = router;
