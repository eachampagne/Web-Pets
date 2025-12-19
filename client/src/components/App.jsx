import React from 'react';
import axios from 'axios';

import SkillDashboard from './SkillDashboard';

const App = () => {
  const [skillData, setSkillData] = React.useState([]);

  // get data on mount
  React.useEffect(() => {
    getSkillData();
  }, []);


  const handleLogout = function() {
    axios.post('/logout', {});
  };

  const getSkillData = function() {
    axios.get('/training')
      .then((response) => {
        setSkillData(response.data);
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Rendering</h1>
      <button onClick={handleLogout}>Logout</button>
      <SkillDashboard skillData={skillData} />
    </div>
  );
};

export default App;
