const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(http:\/\/|https:\/\/)(www\.)?([a-z0-9]+-?[/.]?)+#?$/i.test(v);
      },
      message: 'Введите валидный url',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Введите валидный email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
