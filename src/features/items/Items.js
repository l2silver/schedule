import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField, Button } from '@material-ui/core'
import { HuePicker } from 'react-color';

import uuid from 'uuid/v4';
import {
  add, selectItems
} from './itemSlice';

// import styles from './index.module.css';

export default function Items() {
  const items = useSelector(selectItems);
  const dispatch = useDispatch();


  return (
    <div>
      <h1>Add Items</h1>
      <ul>
        <li onClick={()=>dispatch(add({
          name: 'Default Name',
          color: 'blue',
          id: uuid()
        }))}><Button>+</Button></li>
        {
          Object.keys(items).map(id => {
            const item = items[id];
            return <li key={id}>
              <div>
                <TextField id={`name-${id}`} label="Name" value={item.name} onChange={(event)=>dispatch(add({...item, name: event.target.value}))} />
                <HuePicker
                  color={ item.color }
                  onChangeComplete={(color)=>dispatch(add({
                    ...item, color: color.hex
                  })) }
                />
              </div>
            </li>
          })
        }
      </ul>
    </div>
  );
}
