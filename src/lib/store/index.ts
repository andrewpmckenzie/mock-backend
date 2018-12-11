import {applyMiddleware, createStore} from 'redux';
import {createEpicMiddleware, Epic} from 'redux-observable';
import {MokdAction} from './actions';
import {mokdReducer} from './reducers';

export * from './actions';
export * from './state';
export * from './connect';
export * from './selectors';

export function initStore(rootEpic: Epic<MokdAction, MokdAction>) {
  const epicMiddleware = createEpicMiddleware();
  const store = createStore(mokdReducer, applyMiddleware(epicMiddleware));
  epicMiddleware.run(rootEpic);
  return store;
}
