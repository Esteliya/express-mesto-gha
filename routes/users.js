const router = require('express').Router();
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

// роут создания нового пользователя
router.post('/', createUser);
// роут запроса всех пользователей
router.get('/', getUsers);
// роут запроса пользователя по id
router.get('/:id', getUser);
// роут изменения данных пользователя
router.patch('/me', updateUser);
// роут изменения аватара пользователя
router.patch('/me/avatar', updateAvatar);

module.exports = router;
