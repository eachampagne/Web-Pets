
import React from 'react';
import axios from 'axios';

const Interactions = ({ pet, refreshPet }) => {

  const interactionTabStyles = [
    'border-2',
    'border-black',
    'p-[10px]'
  ];

  const incrementStats = (statName, amount) => {
    // amount = Math.min(amount + pet[statName], 100);
    axios.patch(`/interact/${statName}`, { amount })
      .then(refreshPet)
      .catch(err => {
        console.error('Unable to PATCH interactions on client: ', err);
      });
  };
  
  const checkLogic = ({ target: { value }}) => {
    switch (value) {
      case 'feed':
        incrementStats('hunger', 10);
        break;
      case 'play':
        if (pet.mood > 50) {
          incrementStats('mood', 10);
        }
        break;
      case 'pet':
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
