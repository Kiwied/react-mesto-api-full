const router = require('express').Router();

const {
  getUsers, getUserById, createUser, updateProfileInfo, updateProfileAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', updateProfileInfo);
router.patch('/me/avatar', updateProfileAvatar);

module.exports = router;
