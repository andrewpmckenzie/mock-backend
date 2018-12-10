import {RespondableRequestWithMetadata} from '../interface';

export type RequestsState = RespondableRequestWithMetadata[];

export interface MokdState {
  requests: RequestsState;
}
