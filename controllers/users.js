const mongoose = require('mongoose');

const User = require('../models/user');
const { getUserInfoDisplayedToClient } = require('../helpers/helpers');
const GeneralServerHttpError = require('../errors/GeneralServerHttpError');
const BadRequestHttpError = require('../errors/BadRequestHttpError');
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
    }).catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestHttpError(err.message));
        return;
      }

      next(new GeneralServerHttpError(err));
    });
}

module.exports.getUsers = (req, res, next) => {
  User
    .find({})
    .then((users) => res.json(users.map(getUserInfoDisplayedToClient)))
    .catch((err) => next(new GeneralServerHttpError(err)));
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
    }).catch((err) => next(new GeneralServerHttpError(err)));
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User
    .create({ name, about, avatar })
    .then((createdUser) => res.json(getUserInfoDisplayedToClient(createdUser)))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestHttpError(err.message));
        return;
      }

      next(new GeneralServerHttpError(err));
    });
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
