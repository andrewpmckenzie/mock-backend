import {Observable} from 'rxjs';
import {RespondableRequest} from './Request';

export interface Interceptor {
  receivedRequest: Observable<RespondableRequest>;

  start(): void;
  stop(): void;
}
