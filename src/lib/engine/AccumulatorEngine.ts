import {AbstractEngine} from './AbstractEngine';

export class AccumulatorEngine extends AbstractEngine {
  constructor(private engines: AbstractEngine[]) {
    super(engines.map((e) => e.actionEpic));
  }

  public start() {
    this.engines.forEach((e) => e.start());
  }

  public stop() {
    this.engines.forEach((e) => e.stop());
  }
}
