const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      minLength: [2, 'Минимальная длина поля "name" - 2'],
      maxLength: [30, 'Максимальная длина поля "name" - 30'],
      default: "Жак-Ив Кусто",
    },
    about: {
      type: String,
      required: false,
      minLength: [2, 'Минимальная длина поля "name" - 2'],
      maxLength: [30, 'Максимальная длина поля "name" - 30'],
      default: "Исследователь",
    },
    avatar: {
      type: String,
      required: false,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
      default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    },
    email: {
      type: String,
      required: [true, 'Поле "email" должно быть заполнено'],
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Некорректный email',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле "password" должно быть заполнено'],
      validate: {
        validator: (v) => validator.isStrongPassword(v),
        message: 'Ненадежный пароль. Пароль должен быль не менее 8 символов и содержать цифру, прописную и строчную буквы.',
      },
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  // венем this (модель User)
  return this.findOne({ email })
    .then((user) => {
      // нет такого пользователя — отклоняем
      if (!user) {
        return Promise.reject(new Error('Неверные почта или пароль'));
      }
      // пользователь найден — сравниваем хеши
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неверные почта или пароль'));
      }
      // пользователь авторизован
      return user;
    })
};

const User = mongoose.model('user', userSchema);

module.exports = User;
