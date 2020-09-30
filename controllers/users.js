const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const AnauthorizedError = require('../errors/UnauthorizedError');

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
            .then((user) => res.send({ data: user }))
            .catch((err) => {
              if (err.name === 'MongoError') {
                throw new BadRequestError('Пользователь с таким email уже зарегистрирован');
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

function getAuthorizedUser(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, 'some-secret-key')
    .then((payload) => res.send({ _id: payload._id, email: payload.email }))
    .catch(() => {
      throw new AnauthorizedError('Необходима авторизация');
    })
    .catch(next);
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
        token: jwt.sign({ _id: user._id, email: user.email }, 'some-secret-key', { expiresIn: '7d' }),
      });
    })
    .catch(next);
}

module.exports = {
  getUsers, getUserById, createUser, updateProfileInfo, updateProfileAvatar, login, getAuthorizedUser,
};
