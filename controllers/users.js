const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const { JWT_SECRET = 'dev-key' } = process.env;

function getUsers(req, res, next) {
  User.find({})
    .then((data) => res.send(data))
    .catch(next);
}

function getUserById(req, res, next) {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.send({ data: user });
      }
    })
    .catch(next);
}

function createUser(req, res, next) {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.init()
    .then(() => {
      bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({
            name,
            about,
            avatar,
            email,
            password: hash,
          })
            .then((user) => res.send({
              name: user.name,
              about: user.about,
              avatar: user.avatar,
              email: user.email,
              _id: user._id,
            }))
            .catch((err) => {
              if (err.name === 'MongoError') {
                throw new ConflictError('Пользователь с таким email уже зарегистрирован');
              } else if (err.name === 'ValidationError') {
                throw new BadRequestError('Введены некорректные данные');
              }
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
}

// eslint-disable-next-line consistent-return
function getAuthorizedUser(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    User.findById(payload._id)
      .then((user) => {
        if (user === null) {
          throw new NotFoundError('Пользователь не найден');
        } else {
          res.send({
            _id: user._id,
            email: user.email,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
          });
        }
      })
      .catch(next);
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
}

function updateProfileInfo(req, res, next) {
  const ownerId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(ownerId, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Введены некорректные данные');
      }
    })
    .catch(next);
}

function updateProfileAvatar(req, res, next) {
  const ownerId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(ownerId, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Введены некорректные данные');
      }
    })
    .catch(next);
}

function login(req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' }),
      });
    })
    .catch(next);
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfileInfo,
  updateProfileAvatar,
  login,
  getAuthorizedUser,
};
