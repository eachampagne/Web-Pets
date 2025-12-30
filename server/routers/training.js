const express = require('express');
const { Pet } = require('../db');
const { skills, findAvailableSkills } = require('../data/skills');

const router = express.Router();

// TODO:
// GET stats and behaviors for the pet belonging to the current user
router.get('/', (req, res) => {
  const userId = req.session.passport?.user?.id;

  if (userId === undefined) {
    res.sendStatus(401);
    return;
  }

  const skillId = req.params.id;
  res.status(501).send('get id');
});

// GET all skill levels (but not behaviors) for the pet belonging to the current user
router.get('/stats', (req, res) => {
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

// POST a newly unlocked skill to add to the pet belonging to the current user
router.post('/', (req, res) => {
  // check for authentication
  const userId = req.session.passport?.user?.id;
  if (userId === undefined) {
    res.sendStatus(401);
    return;
  }

  // get data from request
  const { skillName } = req.body;

  // check if the skill to be added is a real skill
  if (!Object.hasOwn(skills, skillName)) {
    // if not, send a 404 and return
    res.sendStatus(404);
    return;
  }

  // look up the pet associated with the logged in user
  Pet.findOne({ userId })
    .then((pet) => {
      // check that user has a pet
      if (!pet) {
        res.sendStatus(404);
        return;
      }

      // check whether the pet already has the skill to avoid duplicates
      if (pet.training.map(skill => skill.name).includes(skillName)) {
        res.sendStatus(409);
        return;
      }

      // add the skill and save the pet
      pet.training.push({name: skillName, stat: 0});

      return pet.save()
        .then(() => {
          res.sendStatus(201);
        });

    })
    .catch((error) => {
      console.error('Failed to find pet', error);
    });
});

// GET available skills at the pet's friendship level that it doesn't have
router.get('/available/', (req, res) => {
  // check for authentication
  const userId = req.session.passport?.user?.id;
  if (userId === undefined) {
    res.sendStatus(401);
    return;
  }

  // look up pet associated with the logged in user
  Pet.findOne({ userId })
    .then((pet) => {
      // check that user has a pet
      if (!pet) {
        res.sendStatus(404);
        return;
      }

      // find available skills based on pet's current stats and send
      const availableSkills = findAvailableSkills(pet.training, pet.love);
      res.status(200).send(availableSkills);
    })
    .catch((error) => {
      console.error('Failed to GET pet\'s available skills', error);
      res.sendStatus(500);
    });
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

      // update the skill, constrained from 0 to 100
      pet.training[pet.training.indexOf(matchingSkill)].stat = newStat > 100 ? 100 : (newStat < 0 ? 0 : newStat);

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

// DELETE a skill to remove it from the pet
router.delete('/:id', (req, res) => {
  // check for authentication
  const userId = req.session.passport?.user?.id;
  if (userId === undefined) {
    res.sendStatus(401);
    return;
  }

  // get data from request
  const skillId = req.params.id;

  // look up the pet associated with the logged in user
  Pet.findOne({userId})
    .then((pet) => {
      // check that user has a pet
      if (!pet) {
        res.sendStatus(404);
        return;
      }
      // remove skill from pet and save the pet
      pet.training.id(skillId).deleteOne();
      return pet.save()
        .then(() => {
            res.sendStatus(200);
          });
    })
    .catch((error) => {
      console.error('Failed to find pet', error);
      res.sendStatus(500);
    });

});

// TODO:
// GET behaviors available to a pet
router.get('/behavior', (req, res) => {
  // check for authentication
  const userId = req.session.passport?.user?.id;
  if (userId === undefined) {
    res.sendStatus(401);
    return;
  }

  res.sendStatus(501);

  // look up pet

    // if doesn't exist, 404

    // get pet's stats

    // send behaviors that pet can do
});

module.exports = router;
