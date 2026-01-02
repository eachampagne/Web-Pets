
import React, { useState } from 'react';

import Skills from './Skills';
import Statuses from './Statuses';
import Interactions from './Interactions';

const DashboardView = ({ pet, user, availableSkills, behaviors, behaviorMessage, refreshSkillData, refreshPet }) => {
  
  const [ tab, setTab ] = useState('Statuses');

  // const { pet, user } = props;
  const tabs = ['Statuses', 'Interactions', 'Skills'];

  const renderTab = () => {
    if (pet) {
      switch (tab) {
        case 'Statuses':
          return <Statuses pet={pet}/>;
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

  const handleTabSelect = (event) => {
    setTab(event.target.name);
  };

  // TODO: display "off" dashboard when logged out instead of displaying nothing
  return (
    <div style={{ border: '1px solid black', marginTop: '5px' }}>
      <p>
        folder thing goes here
      </p>
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
