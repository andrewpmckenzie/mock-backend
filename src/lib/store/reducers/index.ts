import {combineReducers, Reducer} from 'redux';
import {MokdAction} from '../actions';
import {MokdState} from '../state';
import {requestsReducer as requests} from './requests';

export const mokdReducer: Reducer<MokdState, MokdAction> = combineReducers({requests});
