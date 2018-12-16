import {createSelector} from 'reselect';
import {MokdState} from '../state';
import {RequestWithMetadata, RespondFunctionWithId} from '../../interface';

const isReadyForHandling = (r: RequestWithMetadata) => (
    r.handleAt &&
    !r.handlingPaused &&
    r.percentProgress === 1
);

const getRequests = (state: MokdState) => state.requests;

// we exclude the response functions to make it clear that they shouldn't be
// executed directly (instead, use the RespondToRequest action).
export const getRequestsWithoutRespondFunctions = createSelector(getRequests,
    (requests) => requests.map(({respond, ...rest}): RequestWithMetadata => rest));

export const getRequestsWithoutHandlers = createSelector(getRequestsWithoutRespondFunctions,
    (requests) => requests.filter((r) => !r.handler));

export const getRequestsReadyForHandling = createSelector(getRequests,
    (requests) => requests.filter((r) => isReadyForHandling(r)));

export const getTickingRequests = createSelector(getRequestsWithoutRespondFunctions,
    (requests) => requests.filter((r) => r.handler && !r.handlingPaused && !isReadyForHandling(r)));
