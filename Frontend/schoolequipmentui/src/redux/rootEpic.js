import { combineEpics } from 'redux-observable';
import { loginEpic } from '../redux/epics/authEpics';

export const rootEpic = combineEpics(loginEpic);
