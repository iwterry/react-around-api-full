const userRouter = require('express').Router();
const fs = require('fs');
const path = require('path');

const absPathToUserData = path.join(__dirname, '..', 'data', 'users.json');

userRouter.get('/users', (req, res) => {
  fs.readFile(absPathToUserData, { encoding: 'utf8' }, (err, usersJsonString) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'An error has occurred on our end' });
      return;
    }
    res.json(JSON.parse(usersJsonString));
  });
});

userRouter.get('/users/:id', (req, res) => {
  fs.readFile(absPathToUserData, { encoding: 'utf8' }, (err, usersJsonString) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'An error has occurred on our end' });
      return;
    }

    const { id: requestedUserId } = req.params;
    const users = JSON.parse(usersJsonString);
    const requestedUser = users.find(({ _id: someUserId }) => someUserId === requestedUserId);

    if (requestedUser == null) {
      res.status(404).json({ message: 'User ID not found' });
      return;
    }

    res.json(requestedUser);
  });
});

module.exports = userRouter;
