const express = require('express');
const { Pet } = require('../db');

const router = express.Router();

// GET all skill data for the pet belonging to the current user
router.get('/', (req, res) => {
  const userId = req.session.passport?.user?.id;

  if (userId === undefined) {
    res.sendStatus(401);
    return;
  }

  return Pet.find({ userId })
    .then((pets) => {
      if (!pets.length) {
        res.sendStatus(404);
        return;
      }
      res.status(200).send(pets[0].training);
    })
    .catch((err) => {
      console.error('Failed to retrieve pet data:', err);
      res.sendStatus(500);
    });
});

// GET data for the specified skill for the pet belonging to the current user
router.get('/:id', (req, res) => {
  const userId = req.session.passport?.user?.id;

  if (userId === undefined) {
    res.sendStatus(401);
    return;
  }

  const skillId = req.params.id;
  res.send('get id');
});

// PATCH data to update the specified skill by the delta amount for the pet belonging to the current user
router.patch('/:id', (req, res)=> {
  // check for authentication
  const userId = req.session.passport?.user?.id;
  if (userId === undefined) {
    res.sendStatus(401);
    return;
  }

  // get data from request
  const skillId = req.params.id;
  const skillDelta = req.body.delta;

  // look up the pet associated with the logged in user
  Pet.findOne({userId})
    .then((pet) => {
      // check that user has a pet
      if (!pet) {
        res.sendStatus(404);
        return;
      }

      // find the correct skill in the pet's training array
      const matchingSkill = pet.training.id(skillId);
      if (!matchingSkill) {
        res.sendStatus(404);
        return;
      }

      // get the current stat for this skill and add the delta from the request body
      const newStat = matchingSkill.stat + skillDelta;

      // update the skill, capped at 100
      pet.training[pet.training.indexOf(matchingSkill)].stat = newStat < 100 ? newStat : 100;

      // parent document must be saved to save the subdocument
      // https://mongoosejs.com/docs/8.x/docs/subdocs.html
      return pet.save()
        .then(() => {
          res.sendStatus(200);
        });
    })
    .catch((error) => {
      console.error('Failed to PATCH pet skill:', error);
      res.sendStatus(500);
    });
});

module.exports = router;
