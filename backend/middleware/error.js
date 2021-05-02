const { logError, convertErrorToHttpError } = require('../helpers/helpers');

/* parameters "next" and "req" will not be used, but are needed
as this is error middleware, and it requires four parameters */
// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const httpError = convertErrorToHttpError(err);

  if (httpError.httpStatusCode === 500) {
    logError(httpError.origError);
  } else {
    logError(httpError);
  }

  res.status(httpError.httpStatusCode).json({ message: httpError.message });
};
