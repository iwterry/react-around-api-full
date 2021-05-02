const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
require('dotenv').config();

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { login, createUser } = require('./controllers/users');

const NotFoundHttpError = require('./errors/NotFoundHttpError');
const { logError } = require('./helpers/helpers');

const { authWithAuthorizationHeader, authWithCookie } = require('./middleware/auth');
const { errorLogger, requestLogger } = require('./middleware/logger');
const {
  validateSignUp,
  validateSignIn,
  validateAuthHeader,
  validateAuthCookieHeader,
} = require('./middleware/validation');
const centralErrorMiddleware = require('./middleware/error');
const corsMiddleWare = require('./middleware/cors');

const app = express();
const { PORT = 3001, DATABASE_NAME = 'aroundb' } = process.env;

mongoose.connect(`mongodb://localhost:27017/${DATABASE_NAME}`, {
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

app.use(corsMiddleWare);

app.get('/crash-test', () => { // no vaidation for this route
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post('/signin', validateSignIn, login);
app.post('/signup', validateSignUp, createUser);
/*
  Check whether token (using cookie) is valid as way to know
  if user is still signed in.
*/
app.get('/is-token-valid', validateAuthCookieHeader(), authWithCookie);

// NOTE: ########## All routes below this will require authentication ##########
app.use(validateAuthHeader(), authWithAuthorizationHeader);
/*
  When user signs out, clear the cookie so that the backend
  will not have the user logged in.
*/
app.get('/signout', (req, res) => res.clearCookie('jwt', { // check for authentication happens above
  httpOnly: true,
  sameSite: 'none',
  secure: true,
}).end());

// userRouter and cardRouter will be relative
app.use('/users', userRouter); // check for authentication happens above
app.use('/cards', cardRouter); // check for authentication happens above
app.use(() => { // check for authentication happens above
  throw new NotFoundHttpError();
});

app.use(errorLogger);
app.use(errors());
app.use(centralErrorMiddleware);

app.listen(PORT, () => {
  console.log(`express listening on port ${PORT}`);
});
