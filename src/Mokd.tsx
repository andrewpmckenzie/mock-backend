import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import {ConnectedApp} from './components/ConnectedApp';
import {Engine} from './lib/engine/Engine';
import {FetchInterceptor} from './lib/interceptors/FetchInterceptor';
import {XHRInterceptor} from './lib/interceptors/XHRInterceptor';
import {Handler, Interceptor} from './lib/interface';
import {mokdStore} from './lib/store';

export class Mokd {
  public static create(handlers: Handler[]): Mokd {
    return new Mokd(handlers).init();
  }

  private engine: Engine;

  constructor(
      handlers: Handler[] = [],
      interceptors: Interceptor[] = [new XHRInterceptor(), new FetchInterceptor()],
      private fixtureElId = 'mokd',
  ) {
    this.engine = new Engine(handlers, interceptors);
  }

  public init() {
    if (document.readyState === 'complete') {
      this.render();
    } else {
      window.addEventListener('load', () => this.render());
    }

    this.engine.start();

    return this;
  }

  private render() {
    this.appendFixtureElement();
    ReactDOM.render(this.renderApp(), document.getElementById(this.fixtureElId));
  }

  private appendFixtureElement() {
    const fixtureEl = document.createElement('div');
    fixtureEl.id = this.fixtureElId;
    document.body.appendChild(fixtureEl);
  }

  private renderApp() {
    return (<Provider store={mokdStore}><ConnectedApp /></Provider>);
  }
}
