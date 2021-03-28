const mongoose = require('mongoose');
const BadRequestHttpError = require('../errors/BadRequestHttpError');
const GeneralServerHttpError = require('../errors/GeneralServerHttpError');

/*
This function is used to control what data a client can see from the database.
I think it is a good idea in order separate what is in the database versus what
should be seen by client.
*/

function getUserInfoDisplayedToClient(userFromDatabase) {
  return {
    _id: userFromDatabase._id,
    name: userFromDatabase.name,
    about: userFromDatabase.about,
    avatar: userFromDatabase.avatar,
  };
}

function getCardInfoDisplayedToClient(cardFromDatabase) {
  return {
    _id: cardFromDatabase._id,
    name: cardFromDatabase.name,
    link: cardFromDatabase.link,
    likes: cardFromDatabase.likes.map(getUserInfoDisplayedToClient),
    owner: getUserInfoDisplayedToClient(cardFromDatabase.owner),
    createdAt: cardFromDatabase.createdAt,
  };
}

function logError(err) {
  console.log(`Error: ${err}`);
}

function convertErrorToHttpError(err, next) {
  const isValidationOrCastError = (
    err instanceof mongoose.Error.CastError
    || err instanceof mongoose.Error.ValidationError
  );

  if (isValidationOrCastError) {
    next(new BadRequestHttpError(err.message));
    return;
  }

  next(new GeneralServerHttpError(err));
}

module.exports = {
  getUserInfoDisplayedToClient,
  getCardInfoDisplayedToClient,
  logError,
  convertErrorToHttpError,
};
