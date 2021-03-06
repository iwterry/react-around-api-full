const jwt = require('jsonwebtoken');
const AuthenticationHttpError = require('../errors/AuthenticationHttpError');
const { SECRET_KEY_DEV } = require('./constants');

function getNewAuthErr({ method, path }) {
  return new AuthenticationHttpError(`Authentication required for HTTP method "${method}" at path "${path}"`);
}

function getBearerTokenPrefix() {
  return 'Bearer ';
}

function extractBearerToken(str) {
  const TOKEN_PREFIX = getBearerTokenPrefix();
  return str.slice(TOKEN_PREFIX.length);
}

function getTokenFromAuthorizationHeader(req) {
  const { authorization } = req.headers;
  const TOKEN_PREFIX = getBearerTokenPrefix();
  const authErr = getNewAuthErr(req);

  if (!authorization || !authorization.startsWith(TOKEN_PREFIX)) {
    throw authErr;
  }

  return extractBearerToken(authorization);
}

function getTokenFromCookie(req) {
  return req.cookies.jwt;
}

function verifyToken(req, token) {
  const { SECRET_KEY = SECRET_KEY_DEV } = process.env;

  try {
    req.user = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    throw getNewAuthErr(req);
  }
}

module.exports = {
  getTokenFromAuthorizationHeader,
  getTokenFromCookie,
  verifyToken,
};
