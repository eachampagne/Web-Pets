
import React, { useState, useEffect } from 'react';
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

const ScreenView = ({ pet, user, message, initPet, refreshUserStats}) => {

  const refreshTime = 30 * 60 * 1000; // <- 30 minutes

  const styles = {
    screen: [ // { border: '5px inset hotpink', height: '360px', margin: '5px', backgroundColor: 'lavender' }
      'border-10', // border width
      'border-[#a1e7ff]', // border color - a lighter version of the device color to make the inset look right
      'bg-indigo-50', // background color
      'm-bottom-[5px]',
      'm-top-[10px]',
    ],
    input: [
      'rounded-md', // border radius
      'border-2', // border width
    ],
    popup: [
      'text-white',
      'place-self-center',
      'bg-[#333032]'
    ]
  };
/**
 * This is a react hook state being used to set the state of
 * the pet name.
 * @name nameState
 */
  const [name, setName] = useState('');
  const [ weather, setWeather ] = useState({ location: 'New Orleans', condition: 'Clear', temperature: 70 });

  const refreshWeather = () => {
    axios.get(`/weather/loc/${weather.location}`)
      .then(({ data: { location, condition, temperature }}) => {
        setWeather({ location, condition, temperature });
      })
      .catch(err => {
        console.error('Unable to get weather on client: ', err);
      });
  };

  useEffect(() => {
    refreshWeather();
    setInterval(refreshWeather, refreshTime);
  }, []);

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
        refreshUserStats(); // update the user's stats to make sure the status is set to 'befriending'
        initPet(); // get all the data for the new pet
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
      // return (
      //   <div>
      //     <p>{pet.name}</p>
      //   </div>
      // );
      return null;
    } else if (user.name) {
      return (
        <div className={styles.popup.join(' ')}>
          <input className={ styles.input.join(' ') } type='text' value={name} onChange={(e) => setName(e.target.value)}/>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      );
    } else {
      return <div className={styles.popup.join(' ')}>Please sign in</div>;
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
    const { condition } = weather;
    const { status } = user;

    if (status === 'adopted') {
      return 'endingScreen.gif';
    } else if (pet === null) {
      return '/noPet.png';
    } else {
      // if (/sunny|clear/.test(condition)) { return '/sunny.gif'; }
      if (/cloudy/.test(condition)) { return '/cloudy.gif'; }
      else if (/overcast|mist|fog/.test(condition)) { return '/overcast.gif'; }
      else if (/rain|drizzle/.test(condition)) { return '/rainy.gif'; }
      else if (/sleet|snow|ice|blizzard/.test(condition)) { return '/snowy.gif'; }

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
    <div className={ styles.screen.join(' ')} style={{"borderStyle": "inset"}}>
      <img src={chooseImage()} className="w-full" style={{"imageRendering": "pixelated"}}/>
      <div className="bg-[#333032] text-white h-[4.5rem]">
        <p className="h-[1.5rem]">{message}</p>
        <button onClick={ refreshWeather } >{ weather.condition }</button>
        {renderScreenContents()}
      </div>
    </div>
  );
};

export default ScreenView;
