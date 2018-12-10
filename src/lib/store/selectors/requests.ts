import {createSelector} from 'reselect';
import {MokdState} from '../state';
import {RequestWithMetadata, RespondFunctionWithId} from '../../interface';

const getRequests = (state: MokdState) => state.requests;

// we exclude the response functions to make it clear that they shouldn't be
// executed directly (instead, use the RespondToRequest action).
export const getRequestsWithoutRespondFunctions = createSelector(getRequests,
    (requests) => requests.map(({respond, ...rest}): RequestWithMetadata => rest));

export const getRespondFunctions = createSelector(getRequests,
    (requests) => requests.map(({respond, id}): RespondFunctionWithId => ({respond, id})));
