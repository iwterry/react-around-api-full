const User = require('../models/user');
const { getUserInfoDisplayedToClient, convertErrorToHttpError } = require('../helpers/helpers');
const NotFoundHttpError = require('../errors/NotFoundHttpError');

const NOT_FOUND_ERROR_MSG = 'User ID not found';

function updateUserInfo(req, res, next, updatedData) {
  User
    .findByIdAndUpdate(req.user._id, updatedData, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (updatedUser == null) {
        next(new NotFoundHttpError(NOT_FOUND_ERROR_MSG));
        return;
      }

      res.json(getUserInfoDisplayedToClient(updatedUser));
    }).catch((err) => convertErrorToHttpError(err, next));
}

module.exports.getUsers = (req, res, next) => {
  User
    .find({})
    .then((users) => res.json(users.map(getUserInfoDisplayedToClient)))
    .catch((err) => convertErrorToHttpError(err, next));
};

module.exports.getUserById = (req, res, next) => {
  const { id } = req.params;

  User
    .findById(id)
    .then((user) => {
      if (user == null) {
        next(new NotFoundHttpError(NOT_FOUND_ERROR_MSG));
        return;
      }

      res.json(getUserInfoDisplayedToClient(user));
    }).catch((err) => convertErrorToHttpError(err, next));
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User
    .create({ name, about, avatar })
    .then((createdUser) => res.json(getUserInfoDisplayedToClient(createdUser)))
    .catch((err) => convertErrorToHttpError(err, next));
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  const newData = {};

  if (name != null) newData.name = name;
  if (about != null) newData.about = about;

  updateUserInfo(req, res, next, newData);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const newData = {};

  if (avatar != null) newData.avatar = avatar;

  updateUserInfo(req, res, next, newData);
};
