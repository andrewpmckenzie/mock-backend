import {Handler, RequestWithMetadata} from '../lib/interface';
import {connect, getHandlers, getRequestsWithoutRespondFunctions} from '../lib/store';
import {App, AppProps} from './App';

export const ConnectedApp = connect<
    AppProps,
    {handlers: Handler[], requests: RequestWithMetadata[]},
    {},
    typeof App
>(
    App,
    (state) => ({
      handlers: getHandlers(state),
      requests: getRequestsWithoutRespondFunctions(state),
    }), () => ({

    }),
);
