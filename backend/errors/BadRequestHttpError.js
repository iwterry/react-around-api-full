const HttpError = require('./HttpError');

class BadRequestHttpError extends HttpError {
  constructor(message = 'Invalid or incorrectly formatted request') {
    super('BadRequestHttpError', 400, message);
  }
}

module.exports = BadRequestHttpError;
