const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}).then(() => console.log('mongoose listening on port 27017'))
  .catch((err) => console.log(`Error: ${err}`));

mongoose.connection.on('error', (err) => console.log(`Error: ${err}`));

app.use(helmet());
app.use('/', userRouter);
app.use('/', cardRouter);
app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`express listening on port ${PORT}`);
});
