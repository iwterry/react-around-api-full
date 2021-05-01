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

module.exports.authWithCookie = (req, res) => {
  const token = getTokenFromCookie(req);

  try {
    verifyToken(req, token);
  } catch (err) {
    if (err.httpStatusCode !== 401) {
      throw err;
    }
    // user not signed in
    res.send({ jwt: null });

    return;
  }

  // user still signed in.
  // give the token from cookie (which is httpOnly, so frontend JS cannot touch)
  res.json({ jwt: token });
};
