const mongoose = require('mongoose');

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
    // eslint-disable-next-line no-useless-escape
    match: /^https?:\/{2}(www\.)?[\w\.\~\:\/\\\?\%\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\-]+\/?#?$/,
  },
});

module.exports = mongoose.model('user', userSchema);
