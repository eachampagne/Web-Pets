import { useState } from 'react';
import React from 'react';
import axios from 'axios';

const ScreenView = ({ pet }) => {
  const styles = {
    screen: [ // { border: '5px inset hotpink', height: '360px', margin: '5px', backgroundColor: 'lavender' }
      'border-5', // border width
      'border-pink-600', // border color
      'bg-indigo-50', // background color
      'h-[180px]', // height
    ],
    input: [
      'rounded-md', // border radius
      'border-2', // border width
    ]
  };

  const [name, setName] = useState('');

  const handleSubmit = () => {
    if(name === '') {
      // if the user doesn't enter anything the button does nothing
      return;
    }
    axios.post('/pet', { name }) // fix
      .catch((err) => {
        console.error(err, 'coming from dummyPet');
      });
  };

  const renderScreenContents = () => {
    if (pet !== null) {
      return (
        <div>
          <p>{pet.name}</p>
        </div>
      );
    } else {
      return (
        <div>
          <input className={ styles.input.join(' ') } type='text' value={name} onChange={(e) => setName(e.target.value)}/>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      );
    }
  };

  // this is for if the user does not have a pet
  return (
    <div className={ styles.screen.join(' ') }>
      this is the screen - kitty goes here
      {renderScreenContents()}
    </div>
  );
};

export default ScreenView;
