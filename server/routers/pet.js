const express = require('express');
const router = express.Router();
const { Pet } = require('../db');
const { skills } = require('../data/skills.js');

router.get('/', (req, res) => {
  // if user is signed in - we check the session to see if the passport exist
  const { passport } = req.session;
  if (passport) {
    // find the pet with the same userId
    Pet.findOne({ userId: passport.user.id })
      .then((pet) => {
        res.status(200).send(pet);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(404);
      });
  } else {
    res.redirect('/login'); // review and check endpoint later
  }
});

router.post('/', (req, res) => {
  const { passport } = req.session;
  if (passport) {
    Pet.findOne({ userId: passport.user.id })
      .then((pet) => {
        if (pet) {
          res.status(200).send('You already have a pet');
        } else {
          Pet.create({
            userId: passport.user.id,
            name: req.body.name,
            training: Object.keys(skills)
              // only take the skills that the pet has access to at love = 0
              .filter((key) => skills[key].love <= 0)
              // map skill names to skill objects with the stat set to 0
              .map((key) => {
                return {
                  name: key,
                  stat: 0,
                };
              }),
            mood: 0,
            love: 0,
            health: 100,
            hunger: 20,
          })
            .then((pet) => {
              res.status(201).send(pet);
            })
            .catch((err) => {
              console.error(err);
              res.sendStatus(500);
            });
        }
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  } else {
    res.redirect('/login');
  }
});

router.patch('/', (req, res) => {
  const { passport } = req.session;
  if(passport){
    Pet.findOneAndUpdate({ userId: passport.user.id }, { name: req.body.name }, {new: true})
    .then((pet) => {
      // change the name to the req.body.name
      res.status(200).send(pet);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(404);
    });
  } else {
    res.redirect('/login');
  }
});

// delete
router.delete('/', (req, res) => {
  const { passport } = req.session;
  if(passport){
    Pet.findOneAndDelete({ userId: passport.user.id })
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        console.error('This pet does not exist', err);
        res.sendStatus(404);
      });
  } else {
    res.redirect('/login');
  }
});
module.exports = router;
