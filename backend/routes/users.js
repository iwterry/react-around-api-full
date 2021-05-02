const userRouter = require('express').Router();
const {
  getUserById,
  getUsers,
  updateUserProfile,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');
const {
  validateIdRouteParam,
  validateUserProfileUpdate,
  validateUserAvatarUpdate,
} = require('../middleware/validation');

userRouter.get('/', getUsers);
userRouter.get('/me', getCurrentUser);
userRouter.get('/:id', validateIdRouteParam(), getUserById);
userRouter.patch('/me', validateUserProfileUpdate(), updateUserProfile);
userRouter.patch('/me/avatar', validateUserAvatarUpdate(), updateUserAvatar);

module.exports = userRouter;
