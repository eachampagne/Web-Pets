import React from 'react';

function SkillDashboard(props) {



  return (
    <div>
      <h4>Skill Dashboard</h4>
      {props.skillData.map((skill) => <p key={skill.name}>{skill.name}</p>)}
    </div>
  );
}

export default SkillDashboard;
