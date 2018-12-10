import {createStore} from 'redux';
import {mokdReducer} from './reducers';

export * from './actions';
export * from './state';
export * from './connect';
export * from './selectors';

export const mokdStore = createStore(mokdReducer);
