const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const mongoose = require('mongoose');

// порт + БД в отдельной env переменной
// создаем новую БД, т.к. не отрабатывает проверка email на уникальность. Теперь ок.
const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/mestodb_new' } = process.env;

const app = express();

// защищаем приложение, применяя библиотеку Helmet (установка: npm i helmet)
app.use(helmet());

// роуты
const usersRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

// дружим
mongoose.connect(DB_URL, {
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

// хардкодим id пользователя
/* app.use((req, res, next) => {
  req.user = {
    _id: '64aa010d9221495ad59171ba',
  };
  next();
}); */

// роут авторизации
app.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login);
// роут регистрации
app.post('/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    })
      .unknown(true),
  }),
  createUser);

// аутентификация. Мидлвар сработает на роуты ниже (защищаем пользователей и карточки).
app.use(auth)

// слушаем роуты
app.use('/users', usersRouter);
app.use('/cards', cardRouter);

app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Страницы не существует' });
});

// централизованный обработчик ошибок ???????
app.use((err, req, res, next) => {
  /* // Проверяем, является ли ошибка одной из перечисленных статусов
  if ([400, 401, 403, 409, 500].includes(err.status)) {
    // Отправляем соответствующий код ошибки и сообщение
    res.status(err.status).json({ message: err.message });
  } else {
    next(err);
  } */
  if (err.message === 'NotValidId') {
    res.status(404).send({ message: 'Запрошены несуществующие данные' });
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
});

app.listen(PORT);
