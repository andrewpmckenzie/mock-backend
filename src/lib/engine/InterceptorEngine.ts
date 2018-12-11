import {Subscription} from 'rxjs';
import {Interceptor, RespondableRequest, RespondableRequestWithMetadata} from '../interface';
import {addRequest} from '../store';
import {AbstractEngine} from './AbstractEngine';

export class InterceptorEngine extends AbstractEngine {
  private requestIdCounter = 0;
  private subscriptions: Subscription[] = [];

  constructor(private interceptors: Interceptor[]) {
    super();
  }

  public start() {
    this.interceptors.forEach((i) => this.decorateInterceptor(i));
  }

  public stop() {
    this.interceptors.forEach((i) => i.stop());
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.subscriptions = [];
  }

  private decorateInterceptor(interceptor: Interceptor) {
    const subscription = interceptor.receivedRequest.subscribe((r) => this.handleInboundRequest(r));
    this.subscriptions.push(subscription);
    interceptor.start();
  }

  private handleInboundRequest(respondableRequest: RespondableRequest) {
    const requestWithMetadata: RespondableRequestWithMetadata = {
      id: this.requestIdCounter++,
      received: new Date(),
      ...respondableRequest,
    };
    this.dispatchAction.next(addRequest(requestWithMetadata));
  }
}
