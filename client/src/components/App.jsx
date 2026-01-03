import React, { useState, useEffect } from 'react';
import axios from 'axios';

import DeviceView from './DeviceView';

/**
 * The root component of Web Pets. This component handles logging in and out,
 * and renders the DeviceView which contains the rest of the game.
 * @module App
 */
const App = () => {
  /**
   * A state variable that holds user data returned from the server. This is updated upon app
   * initialization and when logging in (when the user is redirected back to the app's homepage)
   * and logging out (explicitly within the handleLogout function).
   * @type {object}
   * @name user
   * @property {string} name - used by App to determine if the user is logged in or out. If user.name is an empty string,
   * the user is assumed to be logged out.
   */
  const [ user, setUser ] = useState({ name: '' });

  /**
   * App requests user data from the server at startup using useEffect.
   * @name Initial User Request
   * @function
   */
  useEffect(() => {
    axios.get('/user')
      .then(({ data }) => {
        setUser({ name: data });
      })
      .catch(err => {
        console.error('Could not get user from client: ', err);
      });
  }, []);

  /**
   * Logs the user out and clears the user object.
   * @name handleLogout
   * @function
   */
  const handleLogout = function() {
    axios.post('/logout', {})
      .then(() => {
        setUser({ name: '' });
      })
      .catch(err => {
        console.error('Could not post from client: ', err);
      });
  };

  /**
   * Renders user information and a login/logout button as appropriate.
   * @name renderAuthData
   * @function
   */
  const renderAuthData = () => {
    const { name } = user;
    if (name) {
      return (
        <div>
          <h2>{`Currently logged in as ${name}`}</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      );
    } else {
      return (<div>
        <h1>Not signed in</h1>
        <a className="button google" href="/login/federated/google">Sign in with Google</a>
      </div>);
    }
  };

  return (
    <div>
      {renderAuthData()}
      <DeviceView user={user}/>
    </div>
  );
};

export default App;
