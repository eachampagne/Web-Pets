
// const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();

const { Pet } = require('../db');

router.patch('/:status', (req, res) => {
  const { passport } = req.session;
  const { status } = req.params;
  const { amount } = req.body;
  
  const patchedObj = {};
  patchedObj[status] = amount;

  if (passport) {
    Pet.findOneAndUpdate({ userId: passport.user.id }, patchedObj)
      .then(pet => {
        if (pet) {
          res.sendStatus(200);
        } else {
          res.sendStatus(404);
        }
      })
      .catch(err => {
        console.error('Unable to find pet and update in interaction route: ', err);
        res.sendStatus(500);
      });
  }
});

module.exports = router;
