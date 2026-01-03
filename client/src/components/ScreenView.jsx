import { useState } from 'react';
import React from 'react';
import axios from 'axios';


/**
 * @module ScreenView
 * @description
 * This component controls what will be displayed in the screen of the application.
 */

/**
 * The beginning of this function shows how the screen is styled. This is what forms
 * the rectangle box that represents the 'screen'. Using destructing to get data from
 * deviceView.
 * @name ScreenView
 */

const ScreenView = ({ pet, user, message , initPet}) => {
  const styles = {
    screen: [ // { border: '5px inset hotpink', height: '360px', margin: '5px', backgroundColor: 'lavender' }
      'border-5', // border width
      'border-pink-600', // border color
      'bg-indigo-50' // background color
    ],
    input: [
      'rounded-md', // border radius
      'border-2', // border width
    ]
  };
/**
 * This is a react hook state being used to set the state of
 * the pet name.
 * @name nameState
 */
  const [name, setName] = useState('');

  /**
 * The handleSubmit function sends a post request to the server
 * when the user provides a name inside the input field when creating/adopting
 * a pet. Note that the user is not allowed to leave the input field blank.
 * @name handleSubmit
 * @property {string} name - name of the pet
 */
  const handleSubmit = () => {
    if(name === '') {
      // if the user doesn't enter anything the button does nothing
      return;
    }
    axios.post('/pet', { name })
      .then(() => {
        initPet();
      })
      .catch((err) => {
        console.error(err, 'coming from screenView');
      });
  };

  /**
 * This will render the name of the pet if the user has pet in the database.
 * If the user does not have a pet, the input box for naming the pet will appear.
 * If the user is not signed in and they try to create a pet, 'Please sign in'
 * will be displayed on the page.
 * @name renderScreenContents
 */
  const renderScreenContents = () => {
    if (pet !== null) {
      return (
        <div>
          <p>{pet.name}</p>
        </div>
      );
    } else if (user.name) {
      return (
        <div>
          <input className={ styles.input.join(' ') } type='text' value={name} onChange={(e) => setName(e.target.value)}/>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      );
    } else {
      return <p>Please sign in</p>;
    }
  };

  /**
 * Depending on if the user is signed in or not, the screen will display a pet or not.
 * If the user is not signed in, not pet will show. If the user is signed in and they have no pet,
 * or the pet ran away, no pet will display. Else, the pet will show on the screen.
 * @name chooseImage
 */
  const chooseImage = () => {
    //TODO: choose gif variants based on weather
    if (pet === null) {
      return '/noPet.png';
    } else {
      return '/sunny.gif';
    }
  };

  // this is for if the user does not have a pet
  /**
 * This is rendering the message that is passed down through props.
 * Also calls the functions above to render the results to the page.
 * @name renderingScreen
 */
  return (
    <div className={ styles.screen.join(' ') }>
      {message}
      {renderScreenContents()}
      <img src={chooseImage()} className="w-[600px] h-[300px]" style={{"imageRendering": "pixelated"}}/>
    </div>
  );
};

export default ScreenView;
