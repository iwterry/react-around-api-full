const userRouter = require('express').Router();
const {
  createUser,
  getUserById,
  getUsers,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.post('/users', createUser);
userRouter.get('/users/:id', getUserById);
userRouter.patch('/users/me', updateUserProfile);
userRouter.patch('/users/me/avatar', updateUserAvatar);

module.exports = userRouter;
