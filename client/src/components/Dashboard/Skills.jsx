import React, { useState } from 'react';
import axios from 'axios';

/**
 * @module Skills
 * @description A component that displays and interacts with the pet's skills.
 * Allows the user to view the pet's current skill levels, to train a skill, to learn a new skill, and to forget existing skills.
 */
function Skills({ skills, mood, availableSkills, behaviors, behaviorMessage, refreshSkillData }) {
  /**
   * A state variable that controls the rendering of the skill change menu. Toggled by clicking the 'Change Skills' heading.
   * @type {boolean}
   * @name menuOpen
  */
  const [menuOpen, setMenuOpen] = useState(false);
  /**
   * A state variable that contains the _id of the skill selected in the 'Forget a skill' dropdown menu. Used to send DELETE requests.
   * @type {string|ObjectId}
   * @name skillToDelete
   */
  const [skillToDelete, setSkillToDelete] = useState('');
  /**
   * A state variable that contains the name of the skill selected in the 'Learn a new skill' dropdown menu. Used to send POST requests.
   * @type {string}
   * @name skillToCreate
   */
  const [skillToCreate, setSkillToCreate] = useState('');

  /**
   * Controls what happens when the user trains a specific skill. One of the possible behaviors for that skill is chosen at random and a message is sent to the screen
   * to describe what the pet does. A request is sent to the server to update the pet's skill level in the database, and a skill refresh is triggered.
   * @name handleClickTraining
   * @function
   * @param {event} event - the event fired by clicking a train skill button
   */
  const handleClickTraining = (event) => {
    const skillName = event.target.getAttribute('data-skillname');
    const possibleBehaviors = behaviors[skillName];
    const behavior = possibleBehaviors[Math.floor(Math.random() * possibleBehaviors.length)];
    behaviorMessage(behavior); // display message on screen describing what the cat did
    axios.patch(`/training/${event.target.name}`, {
      delta: 1 + Math.floor(mood / 25)
    })
      .then(refreshSkillData)
      .catch((error) => {
        console.error(error);
      });
  };

  /**
   * Deletes a skill by sending a DELETE request to the server with the _id of the skill currently selected in the dropdown menu, then triggers a skill refresh.
   * @name handleDeleteSkill
   * @function
   */
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

  /**
   * Deletes a skill by sending a POST request to the server with the name of the skill currently selected in the dropdown menu, then triggers a skill refresh.
   * @name handleCreateSkill
   * @function
   */
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

  /**
   * Renders the create/delete skill section, including the dropdown menus to select skills to learn/forget and buttons to trigger create/delete requests to the server.
   * This section is conditionally rendered only when menuOpen is true (toggled by clicking the Change Skills heading). This declutters the view when not changing skills
   * and makes it more difficult to delete a skill by accident.
   * @name renderSkillChangeMenu
   * @function
   */
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

export default Skills;
