const {
  getTokenFromAuthorizationHeader,
  getTokenFromCookie,
  verifyToken,
} = require('../helpers/auth');

module.exports.authWithAuthorizationHeader = (req, res, next) => {
  const token = getTokenFromAuthorizationHeader(req);
  verifyToken(req, token);
  next();
};

// eslint-disable-next-line no-unused-vars
module.exports.authWithCookie = (req, res, _) => {
  const token = getTokenFromCookie(req);

  try {
    verifyToken(req, token);
  } catch (err) {
    if (err.httpStatusCode !== 401) {
      throw err;
    }

    res.send({ jwt: null });

    return;
  }

  res.json({ jwt: token });
};
