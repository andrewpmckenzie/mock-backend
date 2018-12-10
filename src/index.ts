import {Handler} from './lib/interface';
import {Mokd} from './Mokd';

declare global {
  interface Window {
    mokd: (handlers: Handler[]) => Mokd;
  }
}

((window: Window) => {
  window.mokd = Mokd.create;
})(window || this || {} as Window);
