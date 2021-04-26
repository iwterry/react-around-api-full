const HttpError = require('./HttpError');

class GeneralServerHttpError extends HttpError {
  constructor(origError, message = 'An error has occurred on our end') {
    super('GeneralServerHttpError', 500, message);
    this.origError = origError;
  }
}

module.exports = GeneralServerHttpError;
