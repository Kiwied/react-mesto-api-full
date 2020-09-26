const router = require('express').Router();

const {
  getUsers, getUserById, updateProfileInfo, updateProfileAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', updateProfileInfo);
router.patch('/me/avatar', updateProfileAvatar);

module.exports = router;
