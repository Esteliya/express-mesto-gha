const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const usersRouter = require('./routes/users');

mongoose.connect('mongodb://localhost:27017/mestodb', { family: 4 });

app.use(bodyParser.json());

app.use("/users", usersRouter);

app.listen(3000, () => {
  console.log("Сервер запущен!")
});