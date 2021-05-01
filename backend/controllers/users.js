const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { getUserInfoDisplayedToClient } = require('../helpers/helpers');
const NotFoundHttpError = require('../errors/NotFoundHttpError');
const BadRequestHttpError = require('../errors/BadRequestHttpError');
const { SECRET_KEY_DEV } = require('../helpers/constants');

const NOT_FOUND_ERROR_MSG = 'User ID not found';

function updateUserInfo(req, res, next, updatedData) {
  User
    .findByIdAndUpdate(req.user._id, updatedData, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (updatedUser == null) {
        throw new NotFoundHttpError(NOT_FOUND_ERROR_MSG);
      }

      res.json(getUserInfoDisplayedToClient(updatedUser));
    }).catch(next);
}

function getUserById(id, res, next) {
  User
    .findById(id)
    .then((user) => {
      if (user == null) {
        throw new NotFoundHttpError(NOT_FOUND_ERROR_MSG);
      }

      res.json(getUserInfoDisplayedToClient(user));
    }).catch(next);
}

module.exports.getUsers = (req, res, next) => {
  User
    .find({})
    .then((users) => res.json(users.map(getUserInfoDisplayedToClient)))
    .catch(next);
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

  newData.avatar = avatar;

  updateUserInfo(req, res, next, newData);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  const SALT_LENGTH = 10;

  bcrypt
    .hash(password, SALT_LENGTH)
    .then((hash) => User
      .create({
        name, about, avatar, email, password: hash,
      })
      .catch((err) => {
        // assumption: detection for when duplicate email occurs
        if (err.name === 'MongoError' && err.code === 11000) {
          throw new BadRequestHttpError();
        }
        throw err;
      }))
    .then((createdUser) => res
      .status(201)
      .json(getUserInfoDisplayedToClient(createdUser)))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const { SECRET_KEY = SECRET_KEY_DEV } = process.env;
  const sevenDaysInMilliSeconds = 1000 * 60 * 60 * 24 * 7;

  User
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({
        _id: user._id,
      }, SECRET_KEY, {
        expiresIn: '7 days',
      });

      // Sending cookie as way to remember whether user is logged in.
      // Sending JSON so that client can send the token in the header when making request.
      // The token in the header is used to combat CSRF threat of SameSite=none cookies.
      res
        .cookie('jwt', token, {
          httpOnly: true,
          maxAge: sevenDaysInMilliSeconds,
          sameSite: 'none',
          secure: true,
        })
        .json({ jwt: token });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  getUserById(_id, res, next);
};
