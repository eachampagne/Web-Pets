import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SkillDashboard(props) {
  const handleClickTraining = (event) => {
    axios.patch(`/training/${event.target.name}`, {
      delta: 5
    })
      .then(props.refreshSkillData)
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h4>Skill Dashboard</h4>
      {props.skills.map((skill) => {
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
