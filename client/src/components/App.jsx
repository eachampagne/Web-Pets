import React, { useState, useEffect } from 'react';
import axios from 'axios';

import DeviceView from './DeviceView';

const App = () => {
  const [ user, setUser ] = useState({ name: '' });

  useEffect(() => {
    axios.get('/user')
      .then(({ data }) => {
        setUser({ name: data });
      })
      .catch(err => {
        console.error('Could not get user from client: ', err);
      });
  }, []);

  const handleLogout = function() {
    axios.post('/logout', {})
      .then(() => {
        setUser({ name: '' });
      })
      .catch(err => {
        console.error('Could not post from client: ', err);
      });
  };

  const { name } = user;
  return (
    <div>
      <h1>Rendering</h1>
      <h2>{ name ? `Currently logged in as ${name}` : 'Please sign in!' }</h2>
      <button onClick={handleLogout}>Logout</button>
      <div>
        <h1>Sign in</h1>
        <a className="button google" href="/login/federated/google">Sign in with Google</a>
      </div>
      <DeviceView user={user}/>
    </div>
  );
};

export default App;
