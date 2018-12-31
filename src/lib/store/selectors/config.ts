import {createSelector} from 'reselect';
import {MockBackendState} from '../state';

export const getConfig = (state: MockBackendState) => state.config;

export const getUnclaimedRequestStrategy = createSelector(getConfig, (config) => config.unclaimedRequests);
