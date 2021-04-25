const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { getUserInfoDisplayedToClient, convertErrorToHttpError } = require('../helpers/helpers');
const NotFoundHttpError = require('../errors/NotFoundHttpError');
const BadRequestHttpError = require('../errors/BadRequestHttpError');

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
    }).catch((err) => next(convertErrorToHttpError(err)));
}

function getUserById(id, res, next) {
  User
    .findById(id)
    .then((user) => {
      if (user == null) {
        next(new NotFoundHttpError(NOT_FOUND_ERROR_MSG));
        return;
      }

      res.json(getUserInfoDisplayedToClient(user));
    }).catch((err) => next(convertErrorToHttpError(err)));
}

module.exports.getUsers = (req, res, next) => {
  User
    .find({})
    .then((users) => res.json(users.map(getUserInfoDisplayedToClient)))
    .catch((err) => next(convertErrorToHttpError(err)));
};

module.exports.getUserById = (req, res, next) => {
  const { id } = req.params;

  getUserById(id, res, next);
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

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    next(new BadRequestHttpError('email or password was not provided'));
    return;
  }

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((createdUser) => res.json(getUserInfoDisplayedToClient(createdUser)))
    .catch((err) => next(convertErrorToHttpError(err)));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const sevenDaysInMilliSeconds = 1000 * 60 * 60 * 24 * 7;

  if (!email || !password) {
    throw new BadRequestHttpError('email or password was not provided');
  }

  User
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'fd6fff9317435012847d32443f758c50bad13aeca2ddbdda92d88056ef5dc7df',
        { expiresIn: '7 days' },
      );

      res
        .cookie('jwt', token, {
          httpOnly: true,
          maxAge: sevenDaysInMilliSeconds,
          sameSite: true,
        })
        .end();
    })
    .catch((err) => next(convertErrorToHttpError(err)));
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  getUserById(_id, res, next);
};
