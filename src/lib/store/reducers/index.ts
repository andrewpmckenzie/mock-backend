import {combineReducers, Reducer} from 'redux';
import {MockBackendAction} from '../actions';
import {MockBackendState} from '../state';
import {requestsReducer as requests} from './requests';

export const mockBackendReducer: Reducer<MockBackendState, MockBackendAction> = combineReducers({requests});
