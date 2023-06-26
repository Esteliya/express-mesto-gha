const router = require('express').Router();
const { createUser, getUsers, getUser } = require('../controllers/users');

//роут создания нового пользователя
router.post("/", createUser);
//роут запроса всех пользователей
router.get("/", getUsers);
//роут запроса пользователя по id
router.get("/:id", getUser);

module.exports = router;
