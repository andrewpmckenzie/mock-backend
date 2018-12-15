import {Reducer} from 'redux';
import {RespondableRequestWithMetadata} from '../../interface';
import {MokdAction} from '../actions';
import {RequestsState} from '../state';

const DEFAULT_DELAY = 5000;

function updateRequest(
    state: RequestsState,
    requestId: number,
    processor: (request: RespondableRequestWithMetadata) => RespondableRequestWithMetadata|null,
): RequestsState {
  const index = state.findIndex((r) => r.id === requestId);
  const request = index !== -1 && state[index];

  if (!request) {
    console.error(`Could not find request ${requestId}.`);
    return state;
  }

  const newRequest = processor(request);
  return [...state.slice(0, index), ...(newRequest ? [newRequest] : []), ...state.slice(index + 1)];
}

function tick(request: RespondableRequestWithMetadata): RespondableRequestWithMetadata {
  if (request.handlingPaused) {
    return request;
  }

  const handleAt = request.handleAt || new Date(request.received.getTime() + DEFAULT_DELAY);
  const msTillHandled = Math.max(0, handleAt.getTime() - Date.now());
  return {...request, handleAt, msTillHandled};
}

export const requestsReducer: Reducer<RequestsState, MokdAction> = (state = [], action) => {
  switch (action.type) {
    case 'REQUEST::ADD_REQUEST':
      return [...state, action.respondableRequest];

    case 'REQUEST::ASSIGN_HANDLER':
      const {handler} = action;
      return updateRequest(state, action.requestId, (r) => ({...r, handler}));

    case 'REQUEST::TICK':
      return updateRequest(state, action.requestId, tick);

    case 'REQUEST::HANDLED':
      return updateRequest(state, action.requestId, (r) => null);

    case 'REQUEST::HANDLE_NOW':
      return updateRequest(state, action.requestId, (r) => ({...r, msTillHandled: 0, handleAt: new Date()}));

    case 'REQUEST::PAUSE':
      return updateRequest(state, action.requestId, (r) => ({...r, handlingPaused: true, handleAt: null}));

    case 'REQUEST::UNPAUSE':
      return updateRequest(state, action.requestId,
          (r) => ({...r, handlingPaused: false, handleAt: new Date(Date.now() + (r.msTillHandled || DEFAULT_DELAY))}));

    default:
      return state;
  }
};
