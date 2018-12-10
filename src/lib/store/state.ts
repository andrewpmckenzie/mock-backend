import {Handler, RespondableRequestWithMetadata} from '../interface';

export type HandlersState = Handler[];

export type RequestsState = RespondableRequestWithMetadata[];

export interface MokdState {
  handlers: HandlersState;
  requests: RequestsState;
}
