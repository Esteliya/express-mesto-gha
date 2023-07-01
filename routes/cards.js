const router = require('express').Router();
const { createCard, getCards, deleteCard, likeCard, deleteLikeCard } = require( '../controllers/cards' );

// роут создания новой карточки
router.post('/', createCard);
// роут запроса карточек
router.get('/', getCards);
// роут запроса пользователя по id
router.delete('/:id', deleteCard);
// роут лайка карточки
router.put('/:id/likes', likeCard);
// роут удаления лайка карточки
router.delete('/:id/likes', deleteLikeCard);

// экспорт
module.exports = router;
