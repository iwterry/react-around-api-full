const HttpError = require('./HttpError');

class AuthenticationHttpError extends HttpError {
  constructor(message = 'Incorrect email or password') {
    super('AuthenticationError', 401, message);
  }
}

module.exports = AuthenticationHttpError;
