
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import ScreenView from './ScreenView';
import DashboardView from './Dashboard/DashboardView';

/**
 * @module DeviceView
 * @description The component that controls most of the game client-side. It handles fetching and storing
 * pet data and passing data down to subcomponents.
*/
const DeviceView = ({user, refreshUserStats}) => {
  /**
   * A state variable that holds all pet data returned from the server.
   * @type {object}
   * @name pet
   */
  const [ pet, setPet ] = useState(null);
  /**
   * A state variable that is passed down to render a message on ScreenView.
   * @type {string}
   * @name message
   */
  const [ message, setMessage ] = useState('');
  /**
   * A state variable that holds the skills currently available for the pet to learn.
   * @type {array}
   * @name availableSkills
   */
  const [ availableSkills, setAvailableSkills ] = useState([]);
  /**
   * A state variable that holds the behaviors a pet can currently choose from.
   * @type {object}
   * @name behaviors
   */
  const [ behaviors, setBehaviors ] = useState([]);
  /**
   * A state variable that stores the name currently typed into the change pet name field.
   * Used by changePetName to send PATCH requests.
   * @type {string}
   * @name name
  */
  const [name, setName] = useState('');

  const deviceStyles = [
    'bg-device', // background color
    'sm:rounded-lg', // border radius
    'sm:m-[20px]', // margin
    'p-[15px]', // padding
  ];

  /**
   * Fetches all pet data needed to initiate the game. This includes not just the pet object,
   * but also availableSkills and behaviors. This prevents having to call both refreshPet and
   * refreshSkillData (and having to ensure only one sets pet in state) upon app startup.
   * This function is necessary when the pet changes, for instance when logging in or creating a new pet.
   * @name initPet
   * @function
   */
  const initPet = () => {
    if (user.name) {
      axios.get('/init')
        .then(({ data }) => {
          if (!data) {
            setPet(null);
            setBehaviors([]);
            setAvailableSkills([]);
          } else {
            const { pet, behaviors, available } = data;
            setPet(pet);
            setBehaviors(behaviors);
            setAvailableSkills(available);
          }
        })
        .catch((error) => {
          console.error('Failed to GET initial pet data:', error);
        });
    } else {
      setPet(null);
      setBehaviors([]);
      setAvailableSkills([]);
    }
  };

  /**
   * Fetches and updates the pet object, but not extraneous skill data (availableSkills
   * and behaviors). This is preferred when the skill data is guaranteed not to change;
   * for instance, when playing with or feeding the pet.
   * @name refreshPet
   * @function
   */
  const refreshPet = () => {
    if (user.name) {
      axios.get('/pet')
      .then(({ data }) => {
        if(!data) {
          setPet(null);
        } else {
          setPet(data);
        }
      })
      .catch(err => {
        console.error('Could not get pet on client: ', err);
      });
    } else {
      setPet(null);
    }
  };

  /**
   * Fetches and updates skill data (the pet's training array, availableSkills,
   * and behaviors, but not the rest of the pet object). This is preferred when
   * training the pet, which only affects the pet's skill data, not its mood or
   * other stats.
   * @name refreshSkillData
   * @function
  */
  const refreshSkillData = function(updateTrainingData = true) {
    axios.get('/training/')
      .then(({ data: { training, available, behaviors } }) => {
        // if the whole pet object has just been fetched, (e.g. on login),
        // there's no need to update pet.training and risk some sort of state conflict
        if (updateTrainingData) {
          setPet({
            ...pet,
            training
          });
        }
        setAvailableSkills(available);
        setBehaviors(behaviors);
      })
      .catch((error) => {
        console.error('Failed to get pet skill data:', error);
      });
  };

  /**
   * A function that sets the message that is rendered by ScreenView.
   * This function can be passed down to other subcomponents to allow them
   * to send messages to the screen.
   * @name displayMessage
   * @function
   */
  const displayMessage = function(message) {
    setMessage(message);
  };

  /**
   * A function that sets a message that begins with the pet's name. Can be used
   * by components that don't have access to the entire pet object.
   * @name behaviorMessage
   * @function
  */
  const behaviorMessage = function(behavior) {
    displayMessage(`${pet.name} ${behavior}`);
  };

  /**
   * Sends a DELETE pet request to the server.
   * @name deletePet
   * @function
  */
  const deletePet = () => {
    axios.delete('/pet')
      .then(() => {
        refreshPet();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  /**
   * Sends a PATCH request to the server to update the current pet's name.
   * @name changePetName
   * @function
  */
  const changePetName = () => {
    axios.patch('/pet', {name})
      .then(() => {
        refreshPet();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  /**
   * DeviceView requests all pet and skill data at startup.
   * @name Initial Pet Request
   * @function
   */
  useEffect(initPet, [user.name]);

  return (
    <div id="device" className={ deviceStyles.join(' ') }>
      <div className="relative h-[65px]">
        <div className="absolute right-[50px] bottom-[-23px] flex flex-col gap-3">
          <div className="flex itmes-center gap-2">
            <input type='text'
            value={name}
            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-2.5 py-2 shadow-xs placeholder:'text-body'"
            placeholder='Change pet name'
            onChange={(e) => setName(e.target.value)}/>
            <button
            onClick={changePetName}
            className="text-black bg-blue box-border border border-black hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none"
            >
              Submit
              </button>
          </div>
          <button
          onClick={deletePet}
          className="text-black bg-blue box-border border border-black hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none"
          >
            Delete Pet</button>

        </div>
      </div>
      Web Pets
      <ScreenView
        pet={ pet }
        user = {user}
        message={message}
        initPet={initPet}
        refreshUserStats={refreshUserStats}
      />
      <DashboardView
        pet={pet}
        user={user}
        availableSkills={availableSkills}
        behaviors={behaviors}
        behaviorMessage={behaviorMessage}
        refreshSkillData={refreshSkillData}
        refreshPet={refreshPet}
      />
    </div>
  );
};

export default DeviceView;

