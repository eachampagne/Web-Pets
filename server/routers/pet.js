const express = require('express');
const passport = require('passport');
const router = express.Router();
const db = require('../db');
const skills = require('../data/skills.js');

router.get('/', (req, res) => {
  // if user is signed in - we check the session to see if the passport exist
  const { passport } = req.session;
  if (passport) {
    // find the pet with the same userId
    db.Pet.find({ userId: passport.user.id })
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
    db.Pet.find({ userId: passport.user.id })
      .then((pet) => {
        if (pet) {
          res.status(200).send('You already have a pet');
        } else {
          db.Pet.create({
            userId: passport.user.id,
            petName: req.body.petName,
            training: skills.map((skill) => {
              return {
                name: skill.catergoryName,
                stat: 0,
              };
            }),
            mood: 0,
            love: 0,
            health: 100,
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
    db.Pet.findOneAndUpdate({ userId: passport.user.id }, {petName: req.body.petName}, {new: true})
    .then((pet) => {
      // change the petName to the req.body.petName
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
    db.Pet.findByIdAndDelete({ userId: passport.user.id })
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
