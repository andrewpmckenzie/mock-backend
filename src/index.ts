import {compose} from 'redux';
import {Handler} from './lib/interface';
import {Mokd} from './Mokd';

declare global {
  interface Window {
    mokd: (handlers: Handler[]) => Mokd;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose;
  }
}

((window: Window) => {
  window.mokd = Mokd.create;
})(window || this || {} as Window);
