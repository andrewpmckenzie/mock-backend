import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import {ConnectedApp} from './components/ConnectedApp';
import {FetchInterceptor} from './lib/interceptors/FetchInterceptor';
import {XHRInterceptor} from './lib/interceptors/XHRInterceptor';
import {Handler, Interceptor, RespondableRequestWithMetadata} from './lib/interface';
import {addHandlers, addRequest, mokdStore} from './lib/store';

export class Mokd {
  public static create(handlers: Handler[]): Mokd {
    return new Mokd(handlers).init();
  }

  private requestIdCounter = 0;

  constructor(
      handlers: Handler[] = [],
      private interceptors: Interceptor[] = [new XHRInterceptor(), new FetchInterceptor()],
      private fixtureElId = 'mokd',
  ) {
    mokdStore.dispatch(addHandlers(handlers));
  }

  public init() {
    if (document.readyState === 'complete') {
      this.render();
    } else {
      window.addEventListener('load', () => this.render());
    }

    this.interceptors.forEach((interceptor) => {
      interceptor.receivedRequest.subscribe((respondableRequest) => {
        const requestWithMetadata: RespondableRequestWithMetadata = {
          id: this.requestIdCounter++,
          received: new Date(),
          ...respondableRequest,
        };
        mokdStore.dispatch(addRequest(requestWithMetadata));
      });
      interceptor.start();
    });

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
