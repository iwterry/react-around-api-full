const cardRouter = require('express').Router();
const fs = require('fs');
const path = require('path');

const absPathToUserData = path.join(__dirname, '..', 'data', 'cards.json');

cardRouter.get('/cards', (req, res) => {
  fs.readFile(absPathToUserData, { encoding: 'utf8' }, (err, cardsJsonString) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'An error has occurred on our end' });
      return;
    }
    res.json(JSON.parse(cardsJsonString));
  });
});

module.exports = cardRouter;
