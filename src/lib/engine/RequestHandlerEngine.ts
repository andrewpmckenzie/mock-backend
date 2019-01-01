import {Observable, timer} from 'rxjs';
import {distinctUntilChanged, filter, flatMap, map, withLatestFrom} from 'rxjs/operators';
import {
  Handler,
  isPassthroughHandler,
  RequestWithMetadata,
  UnclaimedRequestStrategy,
} from '../interface';
import {
  assignHandler,
  getConfig,
  getRequestsReadyForHandling,
  getRequestsWithoutHandlers,
  getTickingRequests,
  handled,
  MockBackendState,
  tick,
} from '../store';
import {MockBackendAction} from '../store/actions';
import {AbstractEngine} from './AbstractEngine';

export const DEFAULT_ERROR_HANDLER: Handler = {
  claim: () => true,
  handle: (r) => ({status: 404, body: 'No handler available for this request'}),
  id: 'default-error',
};

export const DEFAULT_PASSTHROUGH_HANDLER: Handler = {
  claim: () => true,
  id: 'default-passThrough',
  passThrough: true,
};

const DEFAULT_RESPONSE_DELAY = 5000;
const TICK_RATE_MS = 50;

export class RequestHandlerEngine extends AbstractEngine {
  private responseDelay = DEFAULT_RESPONSE_DELAY;

  private unclaimedRequestStrategy: UnclaimedRequestStrategy = 'ERROR';
  private handlers: Handler[];

  constructor(handlers: Handler[]) {
    super([
      ($action, $store) => this.assignHandlerEpic($action, $store),
      ($action, $store) => this.tickEpic($action, $store),
      ($action, $store) => this.handleEpic($action, $store),
      ($action, $store) => this.handleConfigUpdate($action, $store),
    ]);

    let anonHandlerCounter = 1;
    this.handlers = handlers.map((h) => ({...h, id: h.id || `anon-${anonHandlerCounter++}`}));
  }

  private tickEpic(
      $action: Observable<MockBackendAction>,
      $store: Observable<MockBackendState>,
  ): Observable<MockBackendAction> {
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
        flatMap((requests) => requests.map((r) => {
          const handler = this.getHandler(r);
          return assignHandler(r.id, handler, isPassthroughHandler(handler) ? 0 : this.responseDelay);
        })),
    );
  }

  private handleEpic(
      $action: Observable<MockBackendAction>,
      $store: Observable<MockBackendState>,
  ): Observable<MockBackendAction> {
    return $store.pipe(
        map(getRequestsReadyForHandling),
        flatMap((requests) => requests.map(({handler, request, respond, passThrough, id}) => {
          if (handler) {
            if (isPassthroughHandler(handler)) {
              passThrough();
            } else {
              const response = handler.handle(request);
              respond(response);
            }
          } else {
            console.error(`Attempted to handle request ${id} that doesn't have a handler.`);
          }
          return handled(id);
        })),
    );
  }

  private handleConfigUpdate(
      $action: Observable<MockBackendAction>,
      $store: Observable<MockBackendState>,
  ): Observable<MockBackendAction> {
    return $store.pipe(
        map(getConfig),
        distinctUntilChanged(),
        map((config) => {
          this.unclaimedRequestStrategy = config.unclaimedRequests || 'ERROR';
          if (typeof config.delayBeforeResponding === 'number') {
            this.responseDelay = config.delayBeforeResponding;
          }
        }),
        // Don't ever fire an action
        filter(() => false),
    ) as Observable<MockBackendAction>;
  }

  private getHandler(rrwm: RequestWithMetadata): Handler {
    return this.handlers.find((h) => h.claim(rrwm.request)) || this.defaultHandler();
  }

  private defaultHandler() {
    switch (this.unclaimedRequestStrategy) {
      case 'PASS_THROUGH':
        return DEFAULT_PASSTHROUGH_HANDLER;
      case 'ERROR':
      default:
        return DEFAULT_ERROR_HANDLER;
    }
  }
}
