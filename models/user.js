const mongoose = require('mongoose');
const { regExForLink } = require('../helpers/constants');

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
    match: regExForLink,
  },
});

module.exports = mongoose.model('user', userSchema);
