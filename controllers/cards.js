const mongoose = require('mongoose');

const Card = require('../models/card');
const User = require('../models/user');

const { getCardInfoDisplayedToClient } = require('../helpers/helpers');
const GeneralServerHttpError = require('../errors/GeneralServerHttpError');
const BadRequestHttpError = require('../errors/BadRequestHttpError');
const NoRightToAccessHttpError = require('../errors/NoRightToAccessHttpError');
const NotFoundHttpError = require('../errors/NotFoundHttpError');

const NOT_FOUND_ERROR_MSG = 'Card ID not found';
const fieldsToPopulate = ['likes', 'owner'];

function updateCardLikes(req, res, next, { isLike, cardId }) {
  const operator = isLike ? '$addToSet' : '$pull';

  return Card
    .findByIdAndUpdate(cardId, {
      [operator]: {
        likes: req.user._id,
      },
    }, {
      new: true,
    }).populate(fieldsToPopulate)
    .then((updatedCard) => {
      if (updatedCard == null) {
        next(new NotFoundHttpError(NOT_FOUND_ERROR_MSG));
        return;
      }

      res.json(getCardInfoDisplayedToClient(updatedCard));
    }).catch((err) => next(new GeneralServerHttpError(err)));
}

module.exports.getCards = (req, res, next) => {
  Card
    .find({})
    .populate(fieldsToPopulate)
    .then((cards) => res.json(cards.map(getCardInfoDisplayedToClient)))
    .catch((err) => next(new GeneralServerHttpError(err)));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card
    .create({ name, link, owner: req.user._id })
    .then((newCard) => User.findById(newCard.owner)
      .then((owner) => {
        /*
        Note: I am disabling rule because there is no harm caused by modiying
        the parameter 'newCard.' Also, copying the data using the spread operator
        created issues.
        */
        // eslint-disable-next-line no-param-reassign
        newCard.owner = owner;
        res.json(getCardInfoDisplayedToClient(newCard));
      }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestHttpError(err.message));
        return;
      }
      next(new GeneralServerHttpError(err));
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { id } = req.params;

  Card
    .findById(id)
    .then((card) => {
      if (card == null) {
        next(new NotFoundHttpError(NOT_FOUND_ERROR_MSG));
        return Promise.resolve();
      }

      if (String(card.owner) !== req.user._id) {
        next(new NoRightToAccessHttpError('Do not have permission to delete this card'));
        return Promise.resolve();
      }

      return Card
        .deleteOne({ _id: card._id })
        .then(() => res.status(204).end());
    }).catch((err) => next(new GeneralServerHttpError(err)));
};

module.exports.likeCard = (req, res, next) => {
  const { id: cardId } = req.params;
  const isLiked = true;
  updateCardLikes(req, res, next, { isLiked, cardId });
};

module.exports.unlikeCard = (req, res, next) => {
  const { id: cardId } = req.params;
  const isLiked = false;
  updateCardLikes(req, res, next, { isLiked, cardId });
};
