import {MockBackendConfig} from '../../interface';

export interface SetConfigAction {
  type: 'CONFIG::SET_CONFIG';
  config: MockBackendConfig;
}

export function setConfig(config: MockBackendConfig): SetConfigAction {
  return {type: 'CONFIG::SET_CONFIG', config};
}

export type ConfigActions = SetConfigAction;
