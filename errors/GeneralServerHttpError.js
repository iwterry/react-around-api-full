const HttpError = require('./HttpError');

class GeneralServerHttpError extends HttpError {
  constructor(otherError, message = 'An error has occurred on our end') {
    super('GeneralServerHttpError', 500, message);
    this.otherError = otherError;
  }
}

module.exports = GeneralServerHttpError;
