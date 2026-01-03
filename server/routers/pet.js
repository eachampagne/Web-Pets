const express = require('express');
const router = express.Router();
const { Pet } = require('../db');
const { skills } = require('../data/skills.js');

/** 
 * @module pet-routers
 * @description
 * This file holds the request handling for when a user sends a request to the express server.
 * This handles any type of fetching, creating, updating, and deletion of pet data.
 */

/**
 * This get request handling will fetch the pet data from the database based on the user that is
 * currently logged in on that session.
 * @name GET /pet
 */
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
    res.sendStatus(401); // review and check endpoint later
  }
});

/**
 * This is the post handling that will handle the post request the user sends when they want to create a pet.
 * It will check if there is an active session for the user that is trying to create a pet. If there is no
 * session - meaning the user is NOT signed in - it will not allow them to create a pet. If a session exist for
 * the user that is signed in, this request handling will check if they have currently have a pet before making
 * one.
 * @name POST /pet
 * @property {string} name - {body parameter} name of the pet
 */
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
    res.sendStatus(401);
  }
});

/**
 * This PATCH request handling allows the user to change the name of the pet
 * that they currently have in the database. It will check if the user is logged in
 * and if they have a pet. If both conditions are true, it will update the name of the pet
 * with whatever the user inputs into the update field.
 * @name PATCH /pet
 * @property {string} name - {body parameter} new name for the pet
 */
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
    res.sendStatus(401);
  }
});

/**
 * This request handling allows the user to delete their pet from the database.
 * @name DELETE /pet
 */
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
    res.sendStatus(401);
  }
});
module.exports = router;
