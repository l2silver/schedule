import React, {useState} from 'react';
import { selectDays } from '../days/daySlice';
import { useSelector } from 'react-redux';
import { selectItems } from '../items/itemSlice';
import { get } from 'lodash';
import { getOrderedSlotsWithStartTime } from '../../utils';
import { Chip, LinearProgress } from '@material-ui/core';
let lastSlotId = null;

const soundUrl = 'http://soundbible.com/grab.php?id=2206&type=mp3';
const audio = new Audio(soundUrl);

export default function Schedule({dayOfWeek}){
  let foundSlot = false;
  const days = useSelector(selectDays);
  const items = useSelector(selectItems);
  const [ currentTime, setTime ] = useState(0);
  setTimeout(()=>{
    setTime(currentTime+1);
  },1000)
  const date = new Date();
  const day = days[dayOfWeek];
  const slotsWithStartTime = getOrderedSlotsWithStartTime(day, items);
  const elapsed = (date.getHours()  - 7) * 60 + date.getMinutes();
  let slotIndex;
  const slot = slotsWithStartTime.find((s, i) => {
    slotIndex = i;
    return s.startTime <= elapsed && elapsed < (s.duration + s.startTime)
  }, null);
  let minutesLeft
  let afterSlot;
  
  if(slot){
    minutesLeft = slot.duration - (elapsed - slot.startTime);
    afterSlot = slotsWithStartTime[slotIndex+1];
  }
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
    slot && <div>
      <div style={{width: afterSlot ? '70%' : '100%', backgroundColor: slot.item.color, display: 'inline-block'}}>
        <h1 style={{marginTop: 0, fontSize: '7rem', marginBottom: '-5rem'}}>{slot.item.name}</h1>
        <h2 style={{marginBottom: -5, fontSize: '4rem'}}>{`Time Left: ${minutesLeft} minutes`}</h2>
        <div style={{padding: 10}}><LinearProgress variant="determinate" value={Math.floor(100*(slot.duration - minutesLeft)/slot.duration)} /></div>
      </div>
      {
        afterSlot && <div style={{width: '30%', backgroundColor: afterSlot.item.color, display: 'inline-block', verticalAlign: 'top'}}>
        <h1>{`Next: ${afterSlot.item.name}`}</h1>
        <h2>{`Time: ${afterSlot.duration} minutes`}</h2>
        </div>
      }
    </div>
  }
    <div style={{
      display: 'flex',
      "justify-content": 'center',
    "flex-wrap": 'wrap',
    }}>
      {slotsWithStartTime.map(s => {
        let color = s.item.color;
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
        return <Chip size="medium" color={color} label={`${s.item.name}-${s.duration}`} />
      })}
    </div>
  </div>
}