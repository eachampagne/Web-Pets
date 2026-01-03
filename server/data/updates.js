
const { Pet, User, Weather } = require('../db');

// this is where pet info will be [scheduled to be] updated
// such as Love/Health increase/decay, Hunger/Mood decay, Skills decay

// Need to set an interval that will run a function at midnight every day to
// retrieve all pets from the database, iterate through each, and calculate
// what changes should be made to each depending on mood/hunger values

/* (thanks Elizabeth)
  * Proposed formulae for daily update: (should calculate with final values of yesterday, not the new values being calculated)
  * Health += 0.4 * hunger - 30 (goes down by 30 at no hunger, goes up by 10 at full hunger)
  * Hunger -= 50
  * Mood = min(current mood, health, and hunger) -> mood won't increase without interaction, and if it's sick or hungry its mood will get worse
  * Love += 0.2 * min(current mood, health, and hunger) - 10 (decreases by 10 at 0 mood/health/hunger and increases by 10 at full -> takes at least 10 days to get it to love/trust you)
  * All values should be constrained between 0 and 100. At 0 health the pet dies, and at 100 love it moves in with you.
*/

let twelveOClock = new Date(`${new Date().toDateString()} 12:00 AM`);
twelveOClock.setDate(twelveOClock.getDate() + 1);

const oneHour = 60 * 60 * 1000;

const updateAllPets = () => {
  Pet.find()
    .then(pets => {
      pets.forEach(pet => {
        const { min, max } = Math;
        const { health, hunger, mood, love, userId } = pet;
        const newStats = {
          health: max(min(health + 0.4 * hunger - 30, 100), 0),
          hunger: max(hunger - 50, 0),
          mood: max(min(mood, health, hunger), 0),
          love: max(min(love + 0.2 * min(mood, health, hunger) - 10, 100), 0),
        };

        // If health is 0, love will decrease, so reaching 100 love and 0 health cannot happen on the same update.
        if (newStats.love >= 100) {
          // the pet is adopted
          // status is adopted
          Pet.findByIdAndDelete(pet._id)
            .then(() => {
              return User.findById(userId);
            })
            .then((user) => {
              // the ternary is so I don't have to go edit the auth route to initiate to 0 to avoid a CastError
              return User.findByIdAndUpdate(userId, {petsAdopted: user.petsAdopted ? user.petsAdopted + 1 : 1, status: 'adopted'});
            })
            .catch(err => {
              console.error('Unable to update database when a pet disappeared: ', err);
            });
        } else if (newStats.health <= 0) {
          // the pet "runs away"
          // status is disappeared
          Pet.findByIdAndDelete(pet._id)
            .then(() => {
              return User.findById(userId);
            })
            .then((user) => {
              // the ternary is so I don't have to go edit the auth route to initiate to 0 to avoid a CastError
              return User.findByIdAndUpdate(userId, {petsDisappeared: user.petsDisappeared ? user.petsDisappeared + 1 : 1, status: 'disappeared'});
            })
            .catch(err => {
              console.error('Unable to update database when a pet disappeared: ', err);
            });
        } else {
          Pet.findByIdAndUpdate(pet._id, newStats, { new: true })
            .then(() => {
              User.findByIdAndUpdate({status: 'normal'});
            })
            .catch(err => {
              console.error('Unable to update a pet in database from updates: ', err);
            });

        }

      });
  })
  .catch(err => {
    console.error('Could not retrieve all pets in updates attempt: ', err);
  });
};

const clearWeatherCache = () => {
  Weather.find()
    .then(weather => {
      weather.forEach(instance => {
        if (((new Date()) - instance.updatedAt) >= oneHour) {
          Weather.deleteOne(instance)
            .catch(err => {
              console.error('Could not delete a weather instance in cache reset: ', err);
            });
        }
      });
    })
    .catch(err => {
      console.error('Unable to find weather data in database: ', err);
    });
};

const handleTimer = () => {
  if (new Date() - twelveOClock >= 0) {
    updateAllPets();
    twelveOClock.setDate(twelveOClock.getDate() + 1);
    clearWeatherCache();
    handleTimer();
  }
  else {
    setTimeout(handleTimer, 1_000);
  }
};

module.exports = {
  updateAllPets,
  handleTimer,
};

