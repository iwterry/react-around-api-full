const Card = require('../models/card');
const User = require('../models/user');

const { getCardInfoDisplayedToClient } = require('../helpers/helpers');
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
        throw new NotFoundHttpError(NOT_FOUND_ERROR_MSG);
      }

      res.json(getCardInfoDisplayedToClient(updatedCard));
    }).catch(next);
}

module.exports.getCards = (req, res, next) => {
  Card
    .find({})
    .populate(fieldsToPopulate)
    .then((cards) => res.json(cards.map(getCardInfoDisplayedToClient)))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card
    .create({ name, link, owner: req.user._id })
    .then((newCard) => User.findById(newCard.owner)
      .then((owner) => {
        /*
        Note: I am disabling rule because there is no harm caused by modifying
        the parameter 'newCard.' Also, copying the data using the spread operator
        created issues.
        */
        // eslint-disable-next-line no-param-reassign
        newCard.owner = owner;
        res.json(getCardInfoDisplayedToClient(newCard));
      }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { id } = req.params;

  Card
    .findById(id)
    .then((card) => {
      if (!card) {
        throw new NotFoundHttpError(NOT_FOUND_ERROR_MSG);
      }

      if (String(card.owner) !== req.user._id) {
        throw new NoRightToAccessHttpError('Do not have permission to delete this card');
      }

      return Card
        .deleteOne({ _id: card._id })
        .then(() => res.status(204).end());
    }).catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { id: cardId } = req.params;
  const isLike = true;
  updateCardLikes(req, res, next, { isLike, cardId });
};

module.exports.unlikeCard = (req, res, next) => {
  const { id: cardId } = req.params;
  const isLike = false;
  updateCardLikes(req, res, next, { isLike, cardId });
};
