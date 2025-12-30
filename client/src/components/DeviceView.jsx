
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import ScreenView from './ScreenView';
import DashboardView from './Dashboard/DashboardView';

const DeviceView = ({user}) => {
  const [ pet, setPet ] = useState(null);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [behaviors, setBehaviors] = useState([]);

  // const cssTest = {
  //   backgroundColor: 'pink',
  //   borderRadius: '20px',
  //   margin: '20px',
  //   padding: '10px',
  // };

  const deviceStyles = [
    'bg-[pink]', // background color
    'rounded-lg', // border radius
    'm-[20px]', // margin
    'p-[15px]', // padding
  ];

  const refreshPet = () => {
    if (user.name) {
      let petExists = false;
      axios.get('/pet')
      .then(({ data }) => {
        if(!data) {
          setPet(null);
        } else {
          setPet(data);
          petExists = true;
        }
      })
      .then(() => {
        if (petExists) { // if no pet exists, this would return a 404
          // but it's not safe to use the state variable yet
          // so just a flag to check if it's worth getting behaviors/available
          refreshSkillData(false);
        }
      })
      .catch(err => {
        console.error('Could not get pet on client: ', err);
      });
    } else {
      setPet(null);
    }
  };

  useEffect(refreshPet, [user.name]);

  const refreshSkillData = function(updateTrainingData = true) {
    axios.get('/training/')
      .then(({ data }) => {
        // if the whole pet object has just been fetched, (e.g. on login),
        // there's no need to update pet.training and risk some sort of state conflict
        if (updateTrainingData) {
          setPet({
            ...pet,
            training: data.training
          });
        }
        setAvailableSkills(data.available);
        setBehaviors(data.behaviors);
      })
      .catch((error) => {
        console.error('Failed to get pet skill data:', error);
      });
  };

  // add a delete button
  const deletePet = () => {
    axios.delete('/pet')
      .catch((err) => {
        console.error(err);
      });
  };

  const [name, setName] = useState('');
  // update petname
  const changePetName = () => {
    axios.patch('/pet', {name})
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div id="device" className={ deviceStyles.join(' ') }>
      this is the device :D
      <ScreenView pet={ pet } user = {user} />
      <DashboardView
        pet={pet}
        user={user}
        availableSkills={availableSkills}
        behaviors={behaviors}
        refreshSkillData={refreshSkillData}
        refreshPet={refreshPet}
      />
      <button onClick={deletePet}>Delete Pet</button>
      <div>
        <input type='text' value={name} onChange={(e) => setName(e.target.value)}/>
        <button onClick={changePetName}>Submit</button>
      </div>
    </div>
  );
};

export default DeviceView;

