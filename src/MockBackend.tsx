import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import {Store} from 'redux';
import {ConnectedApp} from './components/ConnectedApp';
import {StyleBase} from './components/styles/StyleBase';
import {StyledComponentsDemo} from './components/styles/StyledComponentsDemo';
import {AccumulatorEngine} from './lib/engine/AccumulatorEngine';
import {RequestHandlerEngine} from './lib/engine/RequestHandlerEngine';
import {RequestInterceptorEngine} from './lib/engine/RequestInterceptorEngine';
import {FetchInterceptor} from './lib/interceptors/FetchInterceptor';
import {XHRInterceptor} from './lib/interceptors/XHRInterceptor';
import {Handler, Interceptor} from './lib/interface';
import {Engine} from './lib/interface/Engine';
import {initStore, MockBackendAction, MockBackendState} from './lib/store';

export class MockBackend {
  public static create(handlers: Handler[], {
    fixtureElementId = 'mock-backend',
    interceptors = [new XHRInterceptor(), new FetchInterceptor()],
  } = {}): MockBackend {
    return new MockBackend(handlers, interceptors, fixtureElementId).init();
  }

  public static styleDemo({fixtureElementId = 'mock-backend'} = {}): MockBackend {
    return new MockBackend([], [], fixtureElementId).debugStyles();
  }

  private engine: Engine;
  private store: Store<MockBackendState, MockBackendAction>;

  constructor(
      handlers: Handler[],
      interceptors: Interceptor[],
      private fixtureElId: string,
  ) {
    this.engine = new AccumulatorEngine([
        new RequestInterceptorEngine(interceptors),
        new RequestHandlerEngine(handlers),
    ]);
    this.store = initStore(this.engine.actionEpic);
  }

  public init() {
    this.whenDocumentLoads(() => this.render());
    this.engine.start();

    return this;
  }

  public debugStyles() {
    this.whenDocumentLoads(() => this.renderStyleDemo());

    return this;
  }

  public destroy() {
    this.engine.stop();
    this.fixtureEl.remove();
  }

  private whenDocumentLoads(cb: () => void) {
    if (document.readyState === 'complete') {
      cb();
    } else {
      window.addEventListener('load', cb);
    }
  }

  private render() {
    ReactDOM.render((
        <StyleBase>
          <Provider store={this.store}>
            <ConnectedApp />
          </Provider>
        </StyleBase>
    ), this.fixtureEl);
  }

  private renderStyleDemo() {
    ReactDOM.render((<StyledComponentsDemo />), this.fixtureEl);
  }

  private appendFixtureElement() {
    const fixtureEl = document.createElement('div');
    fixtureEl.id = this.fixtureElId;
    document.body.appendChild(fixtureEl);
    return fixtureEl;
  }

  private get fixtureEl() {
    return document.getElementById(this.fixtureElId) || this.appendFixtureElement();
  }
}
