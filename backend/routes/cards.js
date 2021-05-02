const cardRouter = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  unlikeCard,
} = require('../controllers/cards');
const { validateIdRouteParam, validateCardCreation } = require('../middleware/validation');

cardRouter.get('/', getCards);
cardRouter.post('/', validateCardCreation(), createCard);
cardRouter.delete('/:id', validateIdRouteParam(), deleteCard);
cardRouter.put('/:id/likes', validateIdRouteParam(), likeCard);
// A user cannot delete a card if its not the owner of it. An error with status code 403 occur.
cardRouter.delete('/:id/likes', validateIdRouteParam(), unlikeCard);

module.exports = cardRouter;
