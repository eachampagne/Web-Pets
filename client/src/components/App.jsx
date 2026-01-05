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
        if (data !== null) {
          setUser(data);
        } else {
          setUser({name: null});
        }
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
   * Handles requesting updated stats for the user (without overwriting the user's name).
   * @name refreshUserStats
   * @function
   */
  const refreshUserStats = function() {
    axios.get('/user/stats')
      .then(({ data }) => {
        if (data !== null) {
          const { petsAdopted, petsDisappeared, status } = data;
          setUser({
            ...user,
            petsAdopted,
            petsDisappeared,
            status
          });
        } else {
          setUser({name: null});
        }
      })
      .catch(err => {
        console.error('Could not get user from client: ', err);
      });
  };

  /**
   * Sends a request to the server to trigger a pet update now instead of waiting for midnight. Strictly for debugging/demo.
   * Note that this deliberately does not trigger a refresh of the page - the server doesn't actually wait until all pets are updated
   * to send the response, so refreshing immediately might get stale data.
   * @name forceServerUpdate
   * @function
   */
  const forceServerUpdate = function() {
    axios.post('/interact/updatenow')
      .catch((error) => {
        console.error('Failed to trigger server refresh:', error);
      });
  };

  /**
   * Renders user information and a login/logout button as appropriate.
   * @name renderAuthData
   * @function
   */
  const renderAuthData = () => {
    const { name, petsAdopted = 0, petsDisappeared = 0 } = user;
    if (name) {
      return (
        <div>
          <h2>{`Currently logged in as ${name}`}</h2>
          <p>You have adopted {petsAdopted} pet{petsAdopted === 1 ? '' : 's'} and lost {petsDisappeared} pet{petsDisappeared === 1 ? '' : 's'}.</p>
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
    <div className='sm:grid sm:grid-flow-row sm:m-[40px]'>
      <div className="p-[10px] sm:p-[0px]">
        {renderAuthData()}
        <button onClick={forceServerUpdate}>Update Now</button>
      </div>
      <DeviceView user={user} refreshUserStats={refreshUserStats}/>
    </div>
  );
};

export default App;
