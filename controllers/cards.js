const Card = require('../models/card');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

function getCards(req, res, next) {
  Card.find({})
    .then((data) => res.send(data))
    .catch(next);
}

function createCard(req, res, next) {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Введены некорректные данные');
      }
    })
    .catch(next);
}

function deleteCard(req, res, next) {
  Card.findByIdAndRemove(req.params.cardId)
    .then((data) => {
      if (data === null) {
        throw new NotFoundError('Карточка не найдена');
      } else {
        res.send({ message: 'Карточка удалена' });
      }
    })
    .catch(next);
}

function likeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
  )
    .then((data) => {
      if (data === null) {
        throw new NotFoundError('Карточка не найдена');
      } else {
        res.send({ message: 'Лайк' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError('Карточка не найдена');
      }
    })
    .catch(next);
}

function dislikeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
  )
    .then((data) => {
      if (data === null) {
        throw new NotFoundError('Карточка не найдена');
      } else {
        res.send({ message: 'Дизлайк' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError('Карточка не найдена');
      }
    })
    .catch(next);
}

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
