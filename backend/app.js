const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors, celebrate, Joi } = require('celebrate');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const authMiddleware = require('./middleware/auth');
const { login, createUser } = require('./controllers/users');

const NotFoundHttpError = require('./errors/NotFoundHttpError');
const { logError, convertErrorToHttpError } = require('./helpers/helpers');
const { errorLogger, requestLogger } = require('./middleware/logger');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}).then(() => console.log('mongoose listening on port 27017'))
  .catch(logError);

mongoose.connection.on('error', logError);

app.use(requestLogger);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => { // middleware deals with cross origin issues
  const { origin } = req.headers;
  const { method } = req;

  const allowedOrigins = [
    'https://practicum-iwterry.students.nomoreparties.site',
    'https://www.practicum-iwterry.students.nomoreparties.site',
    'http://practicum-iwterry.students.nomoreparties.site',
    'http://www.practicum-iwterry.students.nomoreparties.site',
    'http://localhost:3000',
  ];

  if (allowedOrigins.includes(origin)) {
    res.header('access-control-allow-origin', origin);
    res.header('access-control-allow-credentials', true);
    res.header('access-control-allow-headers', 'Content-Type');
    res.header('access-control-allow-methods', 'GET, POST, PUT, PATCH, DELETE');

    if (method === 'OPTIONS') res.send(); // deal with preflight used for CORS
    else next(); // deals with actual request and not preflight
  } else next(); // deals with origins not allowed
});

app.get('/test-cookie-strict', (req, res, next) => { // testing how cookies work
  res.cookie('test', 'hello world', { httpOnly: true, sameSite: true, secure: true }).end();
});
app.get('/test-cookie-lax', (req, res, next) => { // testing how cookies work
  res.cookie('test', 'hello world', { httpOnly: true, sameSite: 'lax', secure: true }).end();
});
app.get('/test-cookie-none', (req, res, next) => { // testing how cookies work
  res.cookie('test', 'hello world', { httpOnly: true, sameSite: 'none', secure: true }).end();
});
app.use('/test-if-cookie-sent', (req, res, next) => { // testing how cookies work
  res.json('testing to see if coookie is sent');
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri({ scheme: ['http', 'https'] }),
  }),
}), createUser);

app.use('/users', authMiddleware, userRouter);
app.use('/cards', authMiddleware, cardRouter);
app.use((req, res, next) => {
  next(new NotFoundHttpError());
});

app.use(errorLogger);

app.use(errors());

/* the parameter "next" will not be used, but is needed
as this is error middleware and it requires four parameters */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const httpError = convertErrorToHttpError(err);

  if (httpError.httpStatusCode === 500) {
    logError(httpError.origError);
  } else {
    logError(httpError);
  }

  res.status(httpError.httpStatusCode).json({ message: httpError.message });
});

app.listen(PORT, () => {
  console.log(`express listening on port ${PORT}`);
});
