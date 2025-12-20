
import React, { useState } from 'react';

import Skills from './Skills';

const DashboardView = (props) => {
  const [ tab, setTab ] = useState('Skills');


  const { skillData } = props;
  const tabs = ['Statuses', 'Interactions', 'Skills'];

  const renderTab = () => {
    switch (tab) {
      case 'Statuses':
        return <p>Statuses</p>;
      case 'Interactions':
        return <p>Interactions</p>;
      case 'Skills':
        return <Skills skills={skillData}/>;
      default:
        return null;
    }
  };

  const handleTabSelect = (event) => {
    setTab(event.target.name);
  };

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
