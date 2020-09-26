const Card = require('../models/card');

function getCards(req, res) {
  Card.find({})
    .then((data) => res.send(data))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
}

function createCard(req, res) {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
}

function deleteCard(req, res) {
  Card.findByIdAndRemove(req.params.cardId)
    .then((data) => {
      if (data === null) {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.send({ message: 'Карточка удалена' });
      }
    })
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
}

function likeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
  )
    .then((data) => {
      if (data === null) {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.send({ message: 'Лайк' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
}

function dislikeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
  )
    .then((data) => {
      if (data === null) {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.send({ message: 'Дизлайк' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
}

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
