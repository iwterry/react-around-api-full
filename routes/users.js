const userRouter = require('express').Router();
const fs = require('fs');
const path = require('path');

const absPathToUserData = path.join(__dirname, '..', 'data', 'users.json');

userRouter.get('/users', (req, res) => {
  fs.readFile(absPathToUserData, { encoding: 'utf8' }, (err, users) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: 'An error has occurred on our end' });
      return;
    }
    res.send(users);
  });
});

userRouter.get('/users/:id', (req, res) => {
  fs.readFile(absPathToUserData, { encoding: 'utf8' }, (err, usersJsonString) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: 'An error has occurred on our end' });
      return;
    }

    const { id: requestedUserId } = req.params;
    const users = JSON.parse(usersJsonString);
    const requestedUser = users.find(({ _id: someUserId }) => someUserId === requestedUserId);

    if (requestedUser == null) {
      res.status(404).send({ message: 'User ID not found' });
      return;
    }

    res.send(requestedUser);
  });
});

module.exports = userRouter;
