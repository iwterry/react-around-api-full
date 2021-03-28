const HttpError = require('./HttpError');

class NotFoundHttpError extends HttpError {
  constructor(message = 'Requested resource not found') {
    super('NotFoundHttpError', 404, message);
  }
}

module.exports = NotFoundHttpError;
