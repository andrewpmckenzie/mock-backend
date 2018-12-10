import {Reducer} from 'redux';
import {MokdAction} from '../actions';
import {HandlersState} from '../state';

export const handlersReducer: Reducer<HandlersState, MokdAction> = (state = [], action) => {
  switch (action.type) {
    case 'ADD_HANDLER':
      return [...state, action.handler];
    case 'ADD_HANDLERS':
      return [...state, ...action.handlers];
    default:
      return state;
  }
};
