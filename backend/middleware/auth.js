const jwt = require('jsonwebtoken');
const AuthenticationHttpError = require('../errors/AuthenticationHttpError');

module.exports = (req, res, next) => {
  const { jwt: token } = req.cookies;
  const authErr = new AuthenticationHttpError(
    // eslint-disable-next-line comma-dangle
    `User must sign in for HTTP method "${req.method}" at path "${req.path}"`
  );

  try {
    req.user = jwt.verify(token, 'fd6fff9317435012847d32443f758c50bad13aeca2ddbdda92d88056ef5dc7df');
  } catch (err) {
    next(authErr);
    return;
  }

  next();
};
