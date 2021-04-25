const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const authMiddleware = require('./middleware/auth');
const { login, createUser } = require('./controllers/users');

const NotFoundHttpError = require('./errors/NotFoundHttpError');
const { logError, convertErrorToHttpError } = require('./helpers/helpers');

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

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(authMiddleware);

app.use('/', userRouter);
app.use('/', cardRouter);
app.use((req, res, next) => {
  next(new NotFoundHttpError());
});

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
