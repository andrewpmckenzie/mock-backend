import {RespondableRequestWithMetadata} from '../../interface';

export interface AddRequestAction {
  type: 'ADD_REQUEST';
  respondableRequest: RespondableRequestWithMetadata;
}

export function addRequest(respondableRequest: RespondableRequestWithMetadata): AddRequestAction {
  return {type: 'ADD_REQUEST', respondableRequest};
}
