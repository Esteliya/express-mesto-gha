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
router.get('/me', getAuthUser);
// роут изменения данных пользователя
router.patch('/me', updateUser);
// роут запроса пользователя по id
router.get('/:id', getUser);
// роут изменения аватара пользователя
router.patch('/me/avatar', updateAvatar);

module.exports = router;
