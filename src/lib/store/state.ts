import {RespondableRequestWithMetadata} from '../interface';

export type RequestsState = RespondableRequestWithMetadata[];

export interface MockBackendState {
  requests: RequestsState;
}
