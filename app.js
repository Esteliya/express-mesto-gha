// подключаем переменные окружения
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const mongoose = require('mongoose');

const app = express();

// защищаем приложение, применяя библиотеку Helmet (установка: npm i helmet)
app.use(helmet());

// роуты
const usersRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

// дружим
mongoose.connect(process.env['DB_URL'], {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  family: 4,
});

// ПАРСЕРЫ
// извлекаем тело ответа
app.use(bodyParser.json());
// подключаем cookie-parser (анализирует cookie и записывает данные в req.cookies)
app.use(cookieParser());

// роут авторизации
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
// роут регистрации
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/),
    }),
  }),
  createUser,
);

// аутентификация. Мидлвар сработает на роуты ниже (защищаем пользователей и карточки).
app.use(auth);

// слушаем роуты
app.use('/users', usersRouter);
app.use('/cards', cardRouter);

app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Страницы не существует' });
});

app.use(errors());
// централизованный обработчик ошибок
app.use((err, req, res, next) => {
  if (err.message === 'NotValidId') {
    res.status(404).send({ message: 'Запрошены несуществующие данные' });
  } else if (err.message === 'NotData') {
    res.status(401).send({ message: 'Пользователя с таким email или паролем не существует' });
  } else if (err.name === 'ValidationError' || err.name === 'CastError') {
    res.status(400).send({ message: 'Введены некорректные данные' });
  } else if (err.status === 403) {
    res.status(403).send({ message: 'Введены некорректные данные' });
  } else if (err.code === 11000) {
    res.status(409).send({ message: 'Пользователь с таким email уже зарегистрирован' });
  } else if (err.status === 500) {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  } else {
    res.status(err.status).send({ message: err.message });
  }
  next();
});

app.listen(process.env['PORT']);
