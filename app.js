const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// порт + БД в отдельной env переменной
const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

// роуты
const usersRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
// дружим
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});
// извлекаем тело ответа
app.use(bodyParser.json());

// хардкодим id пользователя
app.use((req, res, next) => {
  req.user = {
    _id: '6498ef4a7f96cf0c9aec11f1',
  };
  next();
});

// слушаем роуты
app.use('/users', usersRouter);
app.use('/cards', cardRouter);

app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Страницы не существует' });
});

app.listen(PORT);
