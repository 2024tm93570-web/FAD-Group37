import { combineReducers } from 'redux';
import { authReducer } from './reducer/authReducer.js';

export const rootReducer = combineReducers({
  auth: authReducer,
});
