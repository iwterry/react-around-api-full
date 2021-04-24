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

function doesLinkHaveValidFormat(possibleLink) {
  // from protocol to top-level domain
  // eslint-disable-next-line no-useless-escape
  const firstPartRegEx = /^https?:\/{2}(www\.)?[a-z0-9][a-z0-9\-]*[a-z0-9]\.[a-z][a-z0-9\-]*[a-z0-9]/i;
  // everything after and including the / (forward slash) that follows the top-level domain
  // eslint-disable-next-line no-useless-escape
  const lastPartRegEx = /^\/[\w\.\~\:\/\\\?\%\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]*#?$/i;

  const matchForFirstPart = possibleLink.match(firstPartRegEx);

  if (matchForFirstPart == null) {
    return false;
  }

  const lastPartOfPossibleLink = possibleLink.slice(matchForFirstPart[0].length);
  return lastPartOfPossibleLink === '' || lastPartRegEx.test(lastPartOfPossibleLink);

  /*
  Note: This implementation is only a loose intepretation of what a valid link format really is.
  Due to the complexity involved, I simplified it.
    - The valid protocals are https:// and http://
    - The www. part is optional after https:// or http://
    - The domain name cannot start or end with a hypen (-)
    - The top-level domain can only start with A-Z and a-z
    - The domain name and top-level domain must consist of only A-Z,
      a-z, 0-9, and a hyphen
    - The path following the top-level domain and the forward slash must
      consists of A-Z, a-z, 0-9, and ._~:/?%#[]@!$&'()*+,;= characters
  */
}

module.exports = {
  getUserInfoDisplayedToClient,
  getCardInfoDisplayedToClient,
  logError,
  convertErrorToHttpError,
  doesLinkHaveValidFormat,
};
