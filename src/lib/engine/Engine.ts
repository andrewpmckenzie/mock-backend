import {Handler, Interceptor} from '../interface';
import {InterceptorEngine} from './InterceptorEngine';

export class Engine {
  private interceptorEngine: InterceptorEngine;

  constructor(handlers: Handler[], interceptors: Interceptor[]) {
    this.interceptorEngine = new InterceptorEngine(interceptors);
  }

  public start() {
    this.interceptorEngine.start();
  }

  public stop() {
    this.interceptorEngine.stop();
  }
}
