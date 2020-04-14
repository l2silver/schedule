import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import itemReducer from '../features/items/itemSlice';
import dayReducer from '../features/days/daySlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    items: itemReducer,
    days: dayReducer,
  },
});
