import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import {Store} from 'redux';
import {ConnectedApp} from './components/ConnectedApp';
import {FetchInterceptor} from './lib/interceptors/FetchInterceptor';
import {XHRInterceptor} from './lib/interceptors/XHRInterceptor';
import {Handler, Interceptor} from './lib/interface';
import {initStore, MokdAction, MokdState} from './lib/store';
import {Engine} from './lib/interface/Engine';
import {AccumulatorEngine} from './lib/engine/AccumulatorEngine';
import {InterceptorEngine} from './lib/engine/InterceptorEngine';

export class Mokd {
  public static create(handlers: Handler[]): Mokd {
    return new Mokd(handlers).init();
  }

  private engine: Engine;
  private store: Store<MokdState, MokdAction>;

  constructor(
      handlers: Handler[] = [],
      interceptors: Interceptor[] = [new XHRInterceptor(), new FetchInterceptor()],
      private fixtureElId = 'mokd',
  ) {
    this.engine = new AccumulatorEngine([
        new InterceptorEngine(interceptors),
    ]);
    this.store = initStore(this.engine.actionEpic);
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
    return (<Provider store={this.store}><ConnectedApp /></Provider>);
  }
}
