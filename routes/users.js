const router = require('express').Router();
const {
  getUserInfo,
  updateUser,
} = require('../controllers/users');
const { validateUser } = require('../middlewares/validate');

router.get('/users/me', getUserInfo);

router.patch('/users/me', validateUser, updateUser);

module.exports = router;
