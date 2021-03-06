import {Epic} from 'redux-observable';
import {merge, Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {Engine} from '../interface/Engine';
import {MockBackendAction} from '../store/actions';

export abstract class AbstractEngine implements Engine {
  public actionEpic: Epic<MockBackendAction, MockBackendAction>;

  protected dispatchAction = new Subject<MockBackendAction>();

  private isRunningMutable = false;

  constructor(epics: Array<Epic<MockBackendAction, MockBackendAction>> = []) {
    // TODO: only emit when started
    this.actionEpic = (action$, state$) => merge(
        ...epics.map((e) => e.bind(this)(action$.pipe(filter(() => this.isRunningMutable)), state$)),
        this.dispatchAction.asObservable(),
    ).pipe(filter(() => this.isRunningMutable));
  }

  public start() {
    this.isRunningMutable = true;
    this.onStart();
  }

  public stop() {
    this.isRunningMutable = false;
    this.onStop();
  }

  protected get isRunning() {
    return this.isRunningMutable;
  }

  // Hooks

  protected onStart(): void {
    // no-op
  }

  protected onStop(): void {
    // no-op
  }
}
