const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');

const users = require('./routes/users');
const cards = require('./routes/cards');
const notFound = require('./routes/notFound');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '5f536fa366d2dc07e89ca5c8',
  };
  next();
});

app.use('/users', users);
app.use('/cards', cards);
app.use('*', notFound);

app.listen(PORT);
