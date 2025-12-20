
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import ScreenView from './ScreenView';
import DashboardView from './Dashboard/DashboardView';

const DeviceView = (props) => {
  const defaultPet = {
    petName: '',
    health: 0,
    love: 0,
    mood: 0,
    behaviors: [],
    training: [],
  };

  const [ pet, setPet ] = useState(defaultPet);

  const cssTest = {
    backgroundColor: 'pink',
    borderRadius: '20px',
    margin: '20px',
    padding: '10px',
  };

  useEffect(() => {
    if (props.user.name) {
      axios.get('/pet')
        .then(({ data }) => {
          setPet(data); 
        })
        .catch(err => {
          console.error('Could not get pet on client: ', err);
        });
    } else {
      setPet(defaultPet);
    }
  }, [props.user.name]);

  return (
    <div id="device" style={cssTest}>
      this is the device :D
      <ScreenView pet={ pet } />
      <DashboardView skillData={pet.training} user={props.user}/>
    </div>
  );
};

export default DeviceView;
