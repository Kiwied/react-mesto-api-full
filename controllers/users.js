const bcrypt = require('bcryptjs');
const User = require('../models/user');

function getUsers(req, res) {
  User.find({})
    .then((data) => res.send(data))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
}

function getUserById(req, res) {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
}

function createUser(req, res) {
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
                res.status(400).send({ message: 'Пользователь с таким email уже зарегистрирован', one: err });
              } else if (err.name === 'ValidationError') {
                res.status(400).send({ message: 'Введены некорректные данные', one: err });
              } else {
                res.status(500).send({ message: 'Ошибка сервера' });
              }
            });
        })
        .catch((err) => res.send(err));
    })
    .catch((err) => res.send(err));
}

function updateProfileInfo(req, res) {
  const ownerId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(ownerId, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
}

function updateProfileAvatar(req, res) {
  const ownerId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(ownerId, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
}

module.exports = {
  getUsers, getUserById, createUser, updateProfileInfo, updateProfileAvatar,
};
