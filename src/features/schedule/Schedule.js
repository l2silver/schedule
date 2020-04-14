import React, {useState} from 'react';
import { selectDays } from '../days/daySlice';
import { useSelector } from 'react-redux';
import { selectItems } from '../items/itemSlice';
import { daysOfWeek } from '../days/Days';
import { get } from 'lodash';
import { Chip } from '@material-ui/core';

let lastSlotId = null;

const soundUrl = 'http://soundbible.com/grab.php?id=2206&type=mp3';
const audio = new Audio(soundUrl);

export default function Schedule(){
  let foundSlot = false;
  const days = useSelector(selectDays);
  const items = useSelector(selectItems);
  const [ currentTime, setTime ] = useState(0);
  setTimeout(()=>{
    setTime(currentTime+1);
  },1000)
  const date = new Date();
  const dayOfWeek = daysOfWeek[date.getDay()];
  const day = days[dayOfWeek];
  const orderedDays = [...day].sort((a, b)=>{
    if(a.order > b.order) return 1;
    if(a.order < b.order) return -1;
    return 0;
  });
  const [daysWithStartTime] = orderedDays.reduce(([acc, prevTime], item)=>{
    acc.push({ ...item, item: items[item.itemId], startTime: prevTime});
    return [acc, prevTime + item.duration];
  }, [[], 0]);
  const elapsed = (date.getHours()  - 8) * 60 + date.getMinutes();
  const slot = daysWithStartTime.find(i => {
    return i.startTime <= elapsed && elapsed < (i.duration + i.startTime)
  }, null);
  if(lastSlotId){
    if(slot && slot.id !== lastSlotId){
      audio.play();
      lastSlotId = slot.id;
    }
    if(!slot){
      audio.play();
      lastSlotId = null;
    }
  } else {
    lastSlotId = get(slot, 'id', null);
  }
  return <div>
  {
    slot && <div style={{height: '100%', padding: 200, backgroundColor: slot.item.color}}>
      <h1>{slot.item.name}</h1>
    </div>
  }
    <div style={{
      display: 'flex',
      "justify-content": 'center',
    "flex-wrap": 'wrap',
    }}>
      {daysWithStartTime.map(s => {
        let color;
        if(!slot){
          color='secondary'
        } else {
          if(s.id === slot.id){
            foundSlot = true;
            color='primary'
          } else if(!foundSlot){
            color='secondary'
          }
        }
        return <Chip color={color} label={get(s, 'item.name')} />
      })}
    </div>
  </div>
}