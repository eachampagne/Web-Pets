import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SkillDashboard(props) {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    setSkills(props.skills);
  }, [props.skills]);

  // TODO: - this probably needs to be moved to device
  const refreshSkillData = function() {
    axios.get('/training')
      .then((response) => {
        setSkills(response.data);
      })
      .catch((error) => {
        console.error('Failed to get pet skill data:', error);
      });
  };

  const handleClickTraining = (event) => {
    console.log('click');
    console.log(event.target.name);
  };

  return (
    <div>
      <h4>Skill Dashboard</h4>
      {skills.map((skill) => {
        return <div key={skill.name}>
          <p>{skill.name}</p>
          <meter max='100' value={skill.stat}></meter>
          <button onClick={handleClickTraining} name={skill._id}>Train {skill.name}</button>
        </div>;
      })}
    </div>
  );
}

export default SkillDashboard;
