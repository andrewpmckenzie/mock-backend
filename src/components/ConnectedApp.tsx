import {RequestWithMetadata} from '../lib/interface';
import {connect, getRequestsWithoutRespondFunctions, handleNow, MockBackendAction, pause, unpause} from '../lib/store';
import {App, AppProps} from './App';
import {Dispatch} from 'react';

export const ConnectedApp = connect<
    AppProps,
    {requests: RequestWithMetadata[]},
    {togglePause: (r: RequestWithMetadata) => void, handleNow: (r: RequestWithMetadata) => void},
    typeof App
>(
    App,
    (state) => ({
      requests: getRequestsWithoutRespondFunctions(state),
    }), (dispatch: Dispatch<MockBackendAction>) => ({
      handleNow: (r: RequestWithMetadata) => dispatch(handleNow(r.id)),
      togglePause: (r: RequestWithMetadata) => dispatch(r.handlingPaused ? unpause(r.id) : pause(r.id)),
    }),
);
