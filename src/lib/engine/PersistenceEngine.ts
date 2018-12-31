import {MockBackendConfig} from '../interface';
import {setConfig} from '../store';
import {AbstractEngine} from './AbstractEngine';

// THIS IS A STUB
// It just sets defaultConfig at the moment. It will eventually fetch config from localstorage,
// falling back to defaultConfig.
export class PersistenceEngine extends AbstractEngine {
  constructor(private defaultConfig: MockBackendConfig) {
    super([]);
  }

  protected onStart() {
    this.setInitialConfig();
  }

  private setInitialConfig() {
    this.dispatchAction.next(setConfig(this.defaultConfig));
  }
}
