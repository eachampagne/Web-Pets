
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import ScreenView from './ScreenView';
import DashboardView from './Dashboard/DashboardView';

const DeviceView = ({user}) => {
  const [ pet, setPet ] = useState(null);

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

  useEffect(refreshPet, [user.name]);

  const refreshSkillData = function() {
    axios.get('/training')
      .then(({ data }) => {
        setPet({
          ...pet,
          training: data
        });
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

