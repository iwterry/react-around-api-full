const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { getUserInfoDisplayedToClient } = require('../helpers/helpers');
const NotFoundHttpError = require('../errors/NotFoundHttpError');
const BadRequestHttpError = require('../errors/BadRequestHttpError');

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

  bcrypt
    .hash(password, 10)
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
    .then((createdUser) => res.json(getUserInfoDisplayedToClient(createdUser)))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const sevenDaysInMilliSeconds = 1000 * 60 * 60 * 24 * 7;
  console.log('-----------> login location 1 <-----------');
  User
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'fd6fff9317435012847d32443f758c50bad13aeca2ddbdda92d88056ef5dc7df',
        { expiresIn: '7 days' },
      );
      console.log('-----------> login location 2 <-----------');
      res
        .cookie('jwt', token, {
          httpOnly: true,
          maxAge: sevenDaysInMilliSeconds,
          sameSite: true,
        })
        .end();
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  getUserById(_id, res, next);
};
