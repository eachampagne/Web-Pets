/** @module skillsData*/

/**
 * Behavior type definition
 * @typedef {Object} behavior
 * @property {string} behavior - a description of the pet's actions while performing this behavior
 * @property {number} min - the minimum skill level for the pet to perform this action
 * @property {number} max - the maximum skill level for the pet to perform this action
 * @property {number} prev - the skill level at which the pet stops performing the previous action (unused, originally intended to let the client know when to request updated behaviors)
 * @property {number} next - the skill level at which the pet starts performing the next action (unused, originally intended to let the client know when to request updated behaviors)
*/

/**
 * Skill type definition
 * @typedef {Object} Skill
 * @property {number} love - the love stat required to learn a skill
 * @property {Array<behavior>} behaviors - the list of behaviors associated with this skill
 */

/**
 * The list of all possible skills. A given pet will know a subset of these.
 * @type {Object}
 * @name skills
 */
const skills = {
  "Scratching": {
    love: 0,
    behaviors: [
      {
        behavior: "scratches you.",
        min: 0,
        max: 50,
        next: 40
      },
      {
        behavior: "scratches the wall.",
        prev: 50,
        min:40,
        max: 80,
        next: 65
      },
      {
        behavior: "scratches the scratching post.",
        prev: 80,
        min: 65,
        max: 100
      }
    ]
  },
  "Acrobatics": {
    love: 50,
    behaviors: [
      {
        behavior: "blinks at you.",
        min: 0,
        max: 30,
        next: 20
      },
      {
        behavior: "stretches lazily.",
        prev: 30,
        min: 20,
        max: 60,
        next: 50
      },
      {
        behavior: "pounces!",
        prev: 60,
        min: 50,
        max: 90,
        next: 70
      },
      {
        behavior: "does a flip!",
        prev: 90,
        min: 70,
        max: 100
      }
    ]
  },
  "Litter Box": {
    love: 0,
    behaviors: [
      {
        behavior: "makes a mess.",
        min: 0,
        max: 70,
        next: 30
      },
      {
        behavior: "uses the litter box.",
        prev: 70,
        min: 30,
        max: 100
      }
    ]
  },
  "Hunting": {
    love: 50,
    behaviors: [
      {
        behavior: "ignores you.",
        min: 0,
        max: 40,
        next: 30
      },
      {
        behavior: "brings you a leaf.",
        prev: 40,
        min: 30,
        max: 100,
        next: 60
      },
      {
        behavior: "brings you a rock.",
        prev: 40,
        min: 30,
        max: 100,
        next: 60
      },
      {
        behavior: "brings you a dead bird.",
        prev: 40,
        min: 30,
        max: 100,
        next: 90
      },
      {
        behavior: "brings you a dead rat.",
        prev: 40,
        min: 60,
        max: 100,
        next: 90
      },
      {
        behavior: "brings you a shiny trinket.",
        prev: 40,
        min: 90,
        max: 100,
      }
    ]
  }
};

/**
 * Finds the behaviors that a pet could do based on its current skill levels
 * @param {Array} petTraining - an array of pet training objects with a name and stat
 * @returns {object}
 */
const findBehaviors = (petTraining) => {
  let behaviors = {};

  // don't have to check love stat because pet will only have known skills in training array
  for (let i = 0; i < petTraining.length; i++) {
    const { name: category, stat } = petTraining[i];
    const categoryBehaviors = skills[category].behaviors
      .filter((behavior) => stat >= behavior.min && stat <= behavior.max)
      .map(behavior => behavior.behavior); // just keep the text, not the min/max values

    behaviors[category] = categoryBehaviors;
  }

  return behaviors;
};

/**
 * Finds the skills that a pet does not know, but could learn given its current love stat.
 * @param {Array} petTraining - an array of pet training objects with a name and stat
 * @param {Number} love - the pet's love stat
 * @returns {Array<Skill>}
 */
const findAvailableSkills = (petTraining, love) => {
  const currentSkills = petTraining.map((skill) => skill.name);
  const availableSkills = [];

  for (let skill in skills) {
    if (love >= skills[skill].love && !currentSkills.includes(skill)) {
      availableSkills.push(skill);
    }
  }

  return availableSkills;
};

module.exports = {
  skills,
  findBehaviors,
  findAvailableSkills
};
