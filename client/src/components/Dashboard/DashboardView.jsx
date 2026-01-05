
import React, { useState } from 'react';

import Skills from './Skills';
import Statuses from './Statuses';
import Interactions from './Interactions';

const DashboardView = ({ pet, user, availableSkills, behaviors, behaviorMessage, refreshSkillData, refreshPet }) => {
  
  const [ tab, setTab ] = useState('Interactions');

  // const { pet, user } = props;
  const tabs = ['Interactions', 'Skills'];

  const renderTab = () => {
    if (pet) {
      switch (tab) {
        case 'Interactions':
          return <Interactions pet={ pet } refreshPet={refreshPet} />;
        case 'Skills':
          return <Skills
            skills={pet.training}
            mood={pet.mood}
            availableSkills={availableSkills}
            behaviors={behaviors}
            behaviorMessage={behaviorMessage}
            refreshSkillData={refreshSkillData}
          />;
        default:
          return null;
      }
    } else if (user.name) {
      return <p>Adopt a pet to show its data!</p>;
    } else {
      return <p>Please sign in</p>;
    }
  };

  const onlyStatus = () => {
    if(pet) {
      return <Statuses pet={pet} />;
    }
  };


  const handleTabSelect = (event) => {
    setTab(event.target.name);
  };

  // TODO: display "off" dashboard when logged out instead of displaying nothing
  return (
    <div style={{ border: '1px solid black', marginTop: '5px' }}>
      <div className="border-2 border-solid " >
        Pet Status:
        {onlyStatus()}
      </div>
      <span>
        {tabs.map((tabName) => {
          return <button name={tabName} onClick={handleTabSelect} key={tabName}>{tabName}</button>;
        })}
      </span>
      {renderTab()}
    </div>
      // <Statuses /> or <Interactions /> or <Skills /> depending on state view
  );
};

export default DashboardView;
