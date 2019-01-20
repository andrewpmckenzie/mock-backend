import {AbstractEngine} from './AbstractEngine';

export class AccumulatorEngine extends AbstractEngine {
  constructor(private engines: AbstractEngine[]) {
    super(engines.map((e) => e.actionEpic));
  }

  protected onStart() {
    this.engines.forEach((e) => e.start());
  }

  protected onStop() {
    this.engines.forEach((e) => e.stop());
  }
}
