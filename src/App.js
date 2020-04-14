import React, { useState } from 'react';
import Items from './features/items/Items.js';
import Days, { a11yProps } from './features/days/Days.js';
import { Tabs, Tab } from '@material-ui/core';
import './App.css';
import TabPanel from './components/TabPanel';
import Schedule from './features/schedule/Schedule';


function App() {
  const [ tab, setTab ] = useState("schedule");
  return (
    <div className="App">
      <Tabs value={tab} onChange={(event, newValue)=>{
        console.log('newValue', newValue);
        setTab(newValue)
      }}>
        <Tab label="Schedule" {...a11yProps('schedule')} />
        <Tab label="Items" {...a11yProps('items')} />
        <Tab label="Days" {...a11yProps('days')} />
        
      </Tabs>
      <TabPanel value={tab} index={'schedule'}>
        <Schedule />
      </TabPanel>
      <TabPanel value={tab} index={'items'}>
        <Items />
      </TabPanel>
      <TabPanel value={tab} index={'days'}>
        <Days />
      </TabPanel>
    </div>
  );
}

export default App;
