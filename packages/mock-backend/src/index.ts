import {compose} from 'redux';
import {Handler} from './lib/interface';
import {MockBackend} from './MockBackend';

declare global {
  interface Window {
    MockBackend: typeof MockBackend;
    mockBackend: (handlers: Handler[]) => MockBackend;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose;
  }
}

((window: Window) => {
  window.MockBackend = MockBackend;
  window.mockBackend = MockBackend.create;
})(window || this || {} as Window);
