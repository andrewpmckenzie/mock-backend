import {createSelector} from 'reselect';
import {RequestWithMetadata} from '../../interface';
import {MockBackendState} from '../state';

const isReadyForHandling = (r: RequestWithMetadata) => (
    r.handleAt &&
    !r.handlingPaused &&
    r.percentProgress === 1
);

const getRequests = (state: MockBackendState) => state.requests;

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
