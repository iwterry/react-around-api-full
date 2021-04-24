const mongoose = require('mongoose');
const { doesLinkHaveValidFormat } = require('../helpers/helpers');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: doesLinkHaveValidFormat,
    },
  },
});

module.exports = mongoose.model('user', userSchema);
