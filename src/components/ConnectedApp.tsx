import {RequestWithMetadata} from '../lib/interface';
import {connect, getRequestsWithoutRespondFunctions} from '../lib/store';
import {App, AppProps} from './App';

export const ConnectedApp = connect<
    AppProps,
    {requests: RequestWithMetadata[]},
    {},
    typeof App
>(
    App,
    (state) => ({
      requests: getRequestsWithoutRespondFunctions(state),
    }), () => ({

    }),
);
