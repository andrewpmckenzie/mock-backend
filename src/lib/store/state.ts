import {MockBackendConfig, RespondableRequestWithMetadata} from '../interface';

export type RequestsState = RespondableRequestWithMetadata[];

export type ConfigState = MockBackendConfig;

export interface MockBackendState {
  requests: RequestsState;
  config: ConfigState;
}
