const HttpError = require('./HttpError');

class NoRightToAccessHttpError extends HttpError {
  constructor(message = 'An error has occurred on our end') {
    super('NoRightToAccessHttpError', 403, message);
  }
}

module.exports = NoRightToAccessHttpError;
