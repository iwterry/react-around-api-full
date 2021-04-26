const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  unlikeCard,
} = require('../controllers/cards');

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri({ scheme: ['http', 'https'] }),
  }),
}), createCard);

cardRouter.use('/cards/:id', celebrate({ /* routes below this will use this middleware */
  params: Joi.object().keys({
    id: Joi.string().required().length(24),
  }),
}));

cardRouter.delete('/cards/:id', deleteCard);
cardRouter.put('/cards/:id/likes', likeCard);
cardRouter.delete('/cards/:id/likes', unlikeCard);

module.exports = cardRouter;
