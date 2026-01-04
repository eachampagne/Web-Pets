
// const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();

const { Pet } = require('../db');
const { handleTimer, updateAllPets } = require('../data/updates');

handleTimer();

router.patch('/:status', (req, res) => {
  const { passport } = req.session;
  const { status } = req.params;
  const { amount } = req.body;

  if (passport) {
    Pet.findOne({ userId: passport.user.id })
      .then(pet => {
        if (pet) {
          Pet.updateOne(pet, { [status]: Math.min(pet[status] + amount, 100) })
            .then(() => {
              res.sendStatus(200);
            })
            .catch(err => {
              console.error('Unable to update pet in interactions route: ', err);
              res.sendStatus(500);
            });
        } else {
          res.sendStatus(404);
        }
      })
      .catch(err => {
        console.error('Unable to find pet in interactions route: ', err);
        res.sendStatus(500);
      });
  }
});

router.post('/updatenow', (req, res) => {
  // this is risky because updateAllPets contains asynchronous code, but since it doesn't return a promise there's no way to hold the response until it's done
  // ... but it's only for debug purposes, so it's fine
  updateAllPets();
  res.sendStatus(201);
});

module.exports = router;
