import {Epic} from 'redux-observable';
import {MokdAction} from '../store/actions';

export interface Engine {
  actionEpic: Epic<MokdAction, MokdAction>;
  start(): void;
  stop(): void;
}
