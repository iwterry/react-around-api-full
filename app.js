const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const NotFoundHttpError = require('./errors/NotFoundHttpError');
const HttpError = require('./errors/HttpError');
const GeneralServerHttpError = require('./errors/GeneralServerHttpError');
const { logError } = require('./helpers/helpers');

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

app.use((req, res, next) => {
  req.user = {
    _id: '605eee0c4d206e2c4c99d052',
  };

  next();
});

app.use('/', userRouter);
app.use('/', cardRouter);
app.use((req, res, next) => {
  next(new NotFoundHttpError());
});

app.use((err, req, res, next) => {
  if (!(err instanceof HttpError)) {
    logError(err);
    next(err);
    return;
  }

  if (err instanceof GeneralServerHttpError) logError(err.otherError);
  else logError(err);

  res.status(err.httpStatusCode).json({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`express listening on port ${PORT}`);
});
