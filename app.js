const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

// роуты
const usersRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
// дружим
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});
// извлекаем тело ответа
app.use(bodyParser.json());

// хардкодим id пользователя ????
app.use((req, res, next) => {
  req.user = {
    _id: '6498ef4a7f96cf0c9aec11f1',
  };
  next();
});

// слушаем роуты
app.use('/users', usersRouter);
app.use('/cards', cardRouter);

app.listen(PORT, () => {
  console.log(`Сервер запущен. Порт:${PORT}`);
});
