
import React from 'react';
import axios from 'axios';

/**
 * @module Interactions
 * @description A component that displays and interacts with the pet's statuses.
 * Allows the user to increase the pet's stats, which will decay each day.
 */
const Interactions = ({ pet, refreshPet, displayMessage }) => {

  const interactionTabStyles = [
    'border-2',
    'border-black',
    'p-[10px]'
  ];

  /**
   * Does the actual incrementing PATCH request to the server, sending required info and then refreshing the pet
   * once it's finished. Uses a path parameter to determine which stat to update, and sends the amount to update by via request body.
   * @name incrementStats
   * @function
   * @param {statName} statName - The stat increased when the incrementStats function fires its PATCH request. It's sent as a path parameter
   * for the server to determine which status the user wants to increase.
   * @param {amount} amount - This parameter determines how much the stat is increased by. The calculation for adding this amount to the
   * status is handled on the server, but is essentially added directly to the server's version of the stat, to prevent client-server desync
   * between what the client and the server thinks the pet's true stats are.
   */
  const incrementStats = (statName, amount) => {
    axios.patch(`/interact/${statName}`, { amount })
      .then(refreshPet)
      .catch(err => {
        console.error('Unable to PATCH interactions on client: ', err);
      });
  };

  /**
   * Does the logic check for which request to send and if the player SHOULD be able to do an interaction.
   * Calls the incrementStats function, passing in a corresponding stat and the amount to increment by.
   * @name checkLogic
   * @function
   * @param {event} event - The event fired by clicking an interaction button. The event's target holds the data for
   * which stat the button should increment.
   */
  const checkLogic = ({ target: { value }}) => {
    switch (value) {
      case 'feed':
        displayMessage(`You feed ${pet.name}.`);
        incrementStats('hunger', 10);
        break;
      case 'play':
        if (pet.mood >= 50) {
          displayMessage(`${pet.name} is very playful!`);
          incrementStats('mood', 10);
        } else {
          displayMessage(`${pet.name} doesn't want to play.`);
        }
        break;
      case 'pet':
        displayMessage(`You pet ${pet.name}.`);
        incrementStats('mood', 5);
        break;
    }
  };

  return (
    <div className={interactionTabStyles.join(' ')}>
      <button value='feed' onClick={ checkLogic } >Feed the cat!</button><br />
      <button value='play' onClick={ checkLogic } >Play with the cat!</button><br />
      <button value='pet' onClick={ checkLogic } >Pet the cat!</button>
    </div>
  );
};

export default Interactions;
