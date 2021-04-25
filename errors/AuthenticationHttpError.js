const HttpError = require('./HttpError');

class AuthenticationHttpError extends HttpError {
  constructor(message = 'Unable to authenticate') {
    super('AuthenticationError', 401, message);
  }
}

module.exports = AuthenticationHttpError;
