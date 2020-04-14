import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField, Button, Select, MenuItem, InputLabel } from '@material-ui/core'
import { Tabs, Tab } from '@material-ui/core';
import uuid from 'uuid/v4';
import {
  add, selectDays
} from './daySlice';
import TabPanel from '../../components/TabPanel';
import { selectItems } from '../items/itemSlice';
import { getOrderedSlotsWithStartTime } from '../../utils';
import { debounce } from 'lodash';
export const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
export function a11yProps(index) {
  return {
    id: `wrapped-tab-${index}`,
    'aria-controls': `wrapped-tabpanel-${index}`,
    value: index,
  };
}

export default function Days() {
  const date = new Date();
  const days = useSelector(selectDays);
  const dayofWeek = daysOfWeek[date.getDay()];
  const dayNames = Object.keys(days);
  const [ day, setDay ] = useState(dayofWeek);

  return (
    <div>
      <h1>Change Days</h1>
      <Tabs value={day} onChange={(e, newVal)=>setDay(newVal)} aria-label="simple tabs example">
        {
          dayNames.map(name => {
            return <Tab label={name} {...a11yProps(name)} />
          })
        }
      </Tabs>
      {
        dayNames.map(name => <TabPanel key={name} value={day} index={name}>
          <Day name={day} />
        </TabPanel>)
      }
      
    </div>
  );
}

export function Day({name}){
  const days = useSelector(selectDays);
  const items = useSelector(selectItems);
  const dispatch = useDispatch();
  const day = days[name];
  const onChange = debounce((item, del)=>{
    const nextDay = day.reduce((acc, curr) => {
      if(curr.id === item.id){
        if(!del) acc.push(item);
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);
    const action = add({
      day: name,
      items: nextDay,
    });
    dispatch(action)
  }, 500);
  const orderedSlots = getOrderedSlotsWithStartTime(day, items);
  const slotsWithStartTime = orderedSlots.reduce((acc, slot)=>{
    acc[slot.id] = slot;
    return acc;
  }, {})
  return <div>
    <h2>{`Set Day - ${name}`}</h2>
    <ul>
        <li><Button onClick={()=>dispatch(add({
          day: name,
          items: day.concat({
            id: uuid(),
            itemId: Object.keys(items)[0],
          }),
        }))}>+</Button></li>
        {
          orderedSlots.map(({item, ...slot}) => {
            const { startTime, duration } = slotsWithStartTime[slot.id];
            const startHour = (Math.floor(startTime / 60)+7) % 12 + 1;
            const startMinutes = startTime % 60;
            const am = ((Math.floor(startTime / 60)+7) + 1) <= 11;
            const endTime = startTime + duration;
            const endHour = (Math.floor(endTime / 60)+7) % 12 + 1;
            const endMinutes = startTime % 60;
            const pm = ((Math.floor(endTime / 60)+7) + 1) > 11;
            return <li key={slot.id}>
              <div>
                <p>{`${startHour}:${startMinutes < 10 ? `0${startMinutes}`:startMinutes}${am ? 'am' : 'pm'} - ${endHour}:${endMinutes < 10 ? `0${endMinutes}`:endMinutes}${pm ? 'pm' : 'am'}`}</p>
                <TextField id={`order-${slot.id}`} label="Order" defaultValue={slot.order} type="number" onChange={(event)=>onChange({...slot, order: parseFloat(event.target.value)})} />
                <TextField id={`length-${slot.id}`} label="Length in Minutes" type="number" defaultValue={slot.duration} onChange={(event)=>onChange({...slot, duration: parseFloat(event.target.value)})} />
                <SelectItem id={slot.id} value={slot.itemId} onChange={(event)=>onChange({...slot, itemId: event.target.value})} />
                <Button style={{marginLeft: 100}} onClick={()=>onChange(slot, true)} color="secondary">Delete</Button>
              </div>
            </li>
          })
        }
      </ul>
  </div>
}

function SelectItem({id, value, onChange}){
  const items = useSelector(selectItems);
  const [open, setOpen] = useState(false);
  const handleClose = ()=>setOpen(false);
  const handleOpen = ()=>setOpen(true);
  const handleChange = onChange;
  return <div style={{display: 'inline-block'}}>
    <InputLabel id={`select-${id}`}>Age</InputLabel>
    <Select
        labelId="demo-controlled-open-select-label"
        id="demo-controlled-open-select"
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        value={value}
        onChange={handleChange}
      >
      {Object.keys(items).map(itemId => {
        const item = items[itemId];
        return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
      })}
    </Select>
  </div>
}