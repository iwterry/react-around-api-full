const { celebrate, Joi } = require('celebrate');

const contentTypeHeaderValidation = Joi.string().required().pattern(/^application\/json/);

module.exports.validateIdRouteParam = (paramName = 'id') => celebrate({
  params: Joi.object().keys({
    [paramName]: Joi.string().required().hex().length(24),
  }),
});

module.exports.validateAuthHeader = () => celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().pattern(/^Bearer /),
  }).unknown(true),
});

module.exports.validateAuthCookieHeader = () => celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().required(),
  }).unknown(true),
});

module.exports.validateUserProfileUpdate = () => celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).or('name', 'about'),
  headers: Joi.object().keys({ 'content-type': contentTypeHeaderValidation }).unknown(true),
});

module.exports.validateUserAvatarUpdate = () => celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri({ scheme: ['http', 'https'] }),
  }),
  headers: Joi.object().keys({ 'content-type': contentTypeHeaderValidation }).unknown(true),
});

module.exports.validateCardCreation = () => celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri({ scheme: ['http', 'https'] }),
  }),
  headers: Joi.object().keys({ 'content-type': contentTypeHeaderValidation }).unknown(true),
});

module.exports.validateSignIn = () => celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
  headers: Joi.object().keys({ 'content-type': contentTypeHeaderValidation }).unknown(true),
});

module.exports.validateSignUp = () => celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri({ scheme: ['http', 'https'] }),
  }),
  headers: Joi.object().keys({ 'content-type': contentTypeHeaderValidation }).unknown(true),
});
