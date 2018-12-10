import {Reducer} from 'redux';
import {MokdAction} from '../actions';
import {RequestsState} from '../state';

export const requestsReducer: Reducer<RequestsState, MokdAction> = (state = [], action) => {
  switch (action.type) {
    case 'ADD_REQUEST':
      return [...state, action.respondableRequest];
    default:
      return state;
  }
};
