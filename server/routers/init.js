const express = require('express');
const { Pet } = require('../db');
const { findBehaviors, findAvailableSkills } = require('../data/skills');

const router = express.Router();

/** @module initRouter */

/**
 * This route handles getting all relevant data when loading a pet at app startup.
 * This replaces chained (and conflicting) requests to GET /pet and GET /training.
 * This does NOT replace the initial request to GET /user from <App />.
 * @name GET /init
 */
router.get('/', (req, res) => {
  // check for authentication
  const userId = req.session.passport?.user?.id;
  if (userId === undefined) {
    res.sendStatus(401);
    return;
  }

  // look up pet associated with the user
  Pet.findOne({userId})
    .then((pet) => {
      // check that user has a pet
      if (!pet) {
        res.sendStatus(404);
        return;
      }

      // assemble response data
      const initData = { 
        pet,
        behaviors: findBehaviors(pet.training),
        available: findAvailableSkills(pet.training, pet.love),
        // TODO: add weather data here when available
      };

      res.status(200).send(initData);
    })
    .catch((error) => {
      console.error('Failed to GET all pet data at app initialization', error);
      res.sendStatus(500);
    });
});

module.exports = router;
