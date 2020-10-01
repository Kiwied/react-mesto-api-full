const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUserById, updateProfileInfo, updateProfileAvatar, getAuthorizedUser,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', celebrate({
  headers: Joi.object().keys({
    Authorization: Joi.string().required(),
  }),
}), getAuthorizedUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfileInfo);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), updateProfileAvatar);

module.exports = router;
