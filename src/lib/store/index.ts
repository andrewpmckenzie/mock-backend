import {applyMiddleware, compose, createStore} from 'redux';
import {createEpicMiddleware, Epic} from 'redux-observable';
import {MokdAction} from './actions';
import {mokdReducer} from './reducers';

export * from './actions';
export * from './state';
export * from './connect';
export * from './selectors';

export function initStore(rootEpic: Epic<MokdAction, MokdAction>) {
  const epicMiddleware = createEpicMiddleware();
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(mokdReducer, composeEnhancers(applyMiddleware(epicMiddleware)));
  epicMiddleware.run(rootEpic);
  return store;
}
