import {Epic} from 'redux-observable';
import {merge, Subject} from 'rxjs';
import {Engine} from '../interface/Engine';
import {MokdAction} from '../store/actions';

export abstract class AbstractEngine implements Engine {
  public actionEpic: Epic<MokdAction, MokdAction>;

  protected dispatchAction = new Subject<MokdAction>();

  constructor(epics: Array<Epic<MokdAction, MokdAction>> = []) {
    this.actionEpic = (action$, state$) => merge(
        ...epics.map((e) => e.bind(this)(action$, state$)),
        this.dispatchAction.asObservable(),
    );
  }

  public abstract start(): void;
  public abstract stop(): void;
}
