import {Observable, timer} from 'rxjs';
import {filter, flatMap, map, withLatestFrom} from 'rxjs/operators';
import {Handler, Request, RequestWithMetadata, RespondableRequestWithMetadata} from '../interface';
import {
  assignHandler, getRequestsReadyForHandling,
  getRequestsWithoutHandlers,
  getTickingRequests, handled,
  MockBackendState, tick,
} from '../store';
import {MockBackendAction} from '../store/actions';
import {AbstractEngine} from './AbstractEngine';

export const DEFAULT_HANDLER: Handler = {
  claim: () => true,
  handle: (r) => ({status: 404, body: 'No handler available for this request'}),
  id: 'default',
};

export class RequestHandlerEngine extends AbstractEngine {
  private static TICK_RATE_MS = 500;

  private handlers: Handler[];

  constructor(handlers: Handler[]) {
    super([
      ($action, $store) => this.assignHandlerEpic($action, $store),
      ($action, $store) => this.tickEpic($action, $store),
      ($action, $store) => this.handleEpic($action, $store),
    ]);

    let anonHandlerCounter = 1;
    this.handlers = handlers.map((h) => ({...h, id: h.id || `anon-${anonHandlerCounter++}`}));
  }

  protected onStart(): void {

  }

  protected onStop(): void {

  }

  private tickEpic(
      $action: Observable<MockBackendAction>,
      $store: Observable<MockBackendState>,
  ): Observable<MockBackendAction> {
    const {TICK_RATE_MS} = RequestHandlerEngine;
    return timer(TICK_RATE_MS, TICK_RATE_MS).pipe(
      filter(() => this.isRunning),
      withLatestFrom($store),
      map(([_, state]) => getTickingRequests(state)),
      flatMap((requests) => requests.map((r) => tick(r.id))),
    );
  }

  private assignHandlerEpic(
      $action: Observable<MockBackendAction>,
      $store: Observable<MockBackendState>,
  ): Observable<MockBackendAction> {
    return $store.pipe(
        map(getRequestsWithoutHandlers),
        filter((requests) => requests.length > 0),
        flatMap((requests) => requests.map((r) => assignHandler(r.id, this.getHandler(r)))),
    );
  }

  private handleEpic(
      $action: Observable<MockBackendAction>,
      $store: Observable<MockBackendState>,
  ): Observable<MockBackendAction> {
    return $store.pipe(
        map(getRequestsReadyForHandling),
        flatMap((requests) => requests.map(({handler, request, respond, id}) => {
          if (handler) {
            const response = handler.handle(request);
            respond(response);
          } else {
            console.error(`Attempted to handle request ${id} that doesn't have a handler.`);
          }
          return handled(id);
        })),
    );
  }

  private getHandler(rrwm: RequestWithMetadata): Handler {
    return this.handlers.find((h) => h.claim(rrwm.request)) || DEFAULT_HANDLER;
  }
}
