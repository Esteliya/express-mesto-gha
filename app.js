const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
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

// роуты регистрации и авторизации
app.post('/signin', login);
app.post('/signup', createUser);

// аутентификация. Мидлвар сработает на роуты ниже (защищаем пользователей и карточки).
app.use(auth)

// слушаем роуты
app.use('/users', usersRouter);
app.use('/cards', cardRouter);

app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Страницы не существует' });
});

app.listen(PORT);
