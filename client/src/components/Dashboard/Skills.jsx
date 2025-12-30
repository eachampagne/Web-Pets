import React, { useState } from 'react';
import axios from 'axios';

function SkillDashboard({ skills, availableSkills, behaviors, refreshSkillData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState('');
  const [skillToCreate, setSkillToCreate] = useState('');

  const handleClickTraining = (event) => {
    const skillName = event.target.getAttribute('data-skillname');
    const possibleBehaviors = behaviors[skillName];
    const behavior = possibleBehaviors[Math.floor(Math.random() * possibleBehaviors.length)];
    console.log(`The cat ${behavior}`);
    axios.patch(`/training/${event.target.name}`, {
      delta: 5
    })
      .then(refreshSkillData)
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeleteSkill = () => {
    if (skillToDelete !== '') {
      axios.delete(`/training/${skillToDelete}`)
        .then(() => {
          setSkillToDelete(''); // clear the deleted skill so it can't be deleted again
          refreshSkillData();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleCreateSkill = () => {
    if (skillToCreate !== '') {
      axios.post('/training', {skillName: skillToCreate})
        .then(() => {
          setSkillToCreate(''); // clear the created skill so it can't be created again
          refreshSkillData();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const renderSkillChangeMenu = () => {
    return (
      <div>
        <p>Learn a new skill</p>
        <select onChange={(e) => setSkillToCreate(e.target.value)}>
          <option key={'none'} value={''}>Choose a skill</option>
          {availableSkills.map((skill) => {
            return <option key={skill} value={skill}>{skill}</option>;
          })}
        </select>
        <button onClick={handleCreateSkill}>Learn this skill</button>
        <p>Forget a skill</p>
        <select onChange={(e) => setSkillToDelete(e.target.value)}>
          <option key={'none'} value={''}>Choose a skill</option>
          {skills.map((skill) => {
            return <option key={skill.name} value={skill._id}>{skill.name}</option>;
          })}
        </select>
        <button onClick={handleDeleteSkill}>Forget this skill</button>
      </div>
    );
  };

  return (
    <div>
      <h4>Skill Dashboard</h4>
      {skills.map((skill) => {
        return <div key={skill.name}>
          <p>{skill.name}</p>
          <meter max='100' value={skill.stat}></meter>
          <button onClick={handleClickTraining} name={skill._id} data-skillname={skill.name}>Train {skill.name}</button>
        </div>;
      })}
      <h5 onClick={() => setMenuOpen(m => !m)}>Change Skills</h5>
      {menuOpen ? renderSkillChangeMenu() : null}
    </div>
  );
}

export default SkillDashboard;
