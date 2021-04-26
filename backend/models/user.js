const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AuthenticationHttpError = require('../errors/AuthenticationHttpError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Jacques Cousteau',
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Explorer',
  },
  avatar: {
    type: String,
    validate: {
      validator: validator.isURL,
    },
    default: 'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByEmail(email, password) {
  const authErr = new AuthenticationHttpError();

  return this
    .findOne({ email })
    .select('+password')
    .then((aUser) => {
      if (!aUser) {
        throw authErr;
      }

      return bcrypt
        .compare(password, aUser.password)
        .then((doesPasswordMatch) => {
          if (!doesPasswordMatch) {
            throw authErr;
          }

          return aUser;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
