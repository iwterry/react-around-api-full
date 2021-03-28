const cardRouter = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  unlikeCard,
} = require('../controllers/cards');

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', createCard);
cardRouter.delete('/cards/:id', deleteCard);
cardRouter.put('/cards/:id/likes', likeCard);
cardRouter.delete('/cards/:id/likes', unlikeCard);

module.exports = cardRouter;
