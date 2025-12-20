
import React, { useState } from 'react';

import Skills from './Skills';
import Statuses from './Statuses';
const DashboardView = (props) => {
  const [ tab, setTab ] = useState('Skills');


  const { pet, user } = props;
  const tabs = ['Statuses', 'Interactions', 'Skills'];

  const renderTab = () => {
    switch (tab) {
      case 'Statuses':
        return <Statuses />;
      case 'Interactions':
        return <p>Interactions</p>;
      case 'Skills':
        return <Skills skills={pet.training} refreshSkillData={props.refreshSkillData}/>;
      default:
        return null;
    }
  };

  const handleTabSelect = (event) => {
    setTab(event.target.name);
  };

  // TODO: display "off" dashboard when logged out instead of displaying nothing
  return user.name ? (
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
  ) : null;
};

export default DashboardView;
