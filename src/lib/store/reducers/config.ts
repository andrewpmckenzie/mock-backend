import {Reducer} from 'redux';
import {MockBackendAction} from '../actions';
import {ConfigState} from '../state';

export const configReducer: Reducer<ConfigState, MockBackendAction> = (state = {}, action) => {
  switch (action.type) {
    case 'CONFIG::SET_CONFIG':
      return action.config;
    default:
      return state;
  }
};
