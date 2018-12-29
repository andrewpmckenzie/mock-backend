import {Epic} from 'redux-observable';
import {MockBackendAction} from '../store/actions';

export interface Engine {
  actionEpic: Epic<MockBackendAction, MockBackendAction>;
  start(): void;
  stop(): void;
}
