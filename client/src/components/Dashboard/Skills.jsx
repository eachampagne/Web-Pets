import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SkillDashboard({ skills, refreshSkillData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState('');
  const [skillToCreate, setSkillToCreate] = useState('');

  // FOR TESTING ONLY
  // this will eventually get moved to DeviceView and might not be necessary at all once I have a single training endpoint that does everything
  const [availableSkills, setAvailableSkills] = useState([]);
  const refreshAvailableSkills = function() {
    return axios.get('/training/available')
      .then(response => setAvailableSkills(response.data))
      .catch((error) => console.error('failed to get available skills', error));
  };
  useEffect(() => {
    refreshAvailableSkills();
  }, []);

  const handleClickTraining = (event) => {
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
        .then(refreshAvailableSkills)
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
        .then(refreshAvailableSkills)
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
          <button onClick={handleClickTraining} name={skill._id}>Train {skill.name}</button>
        </div>;
      })}
      <h5 onClick={() => setMenuOpen(m => !m)}>Change Skills</h5>
      {menuOpen ? renderSkillChangeMenu() : null}
    </div>
  );
}

export default SkillDashboard;
