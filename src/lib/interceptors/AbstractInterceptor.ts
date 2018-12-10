import {Observable, Subject} from 'rxjs';
import {Interceptor, Request, RespondableRequest, Response} from '../interface';

export abstract class AbstractInterceptor implements Interceptor {
  public receivedRequest: Observable<RespondableRequest>;
  protected receivedRequestSubject = new Subject<RespondableRequest>();

  constructor() {
    this.receivedRequest = this.receivedRequestSubject.asObservable();
  }

  public abstract start(): void;
  public abstract stop(): void;

  protected createRequest(
      url: string,
      body: string = '',
      method: string = '',
      headers: {[k: string]: string} = {},
  ): Request {
    return {
      body,
      bodyJson: this.maybeParseBody(body),
      headers: {...(headers || {})},
      method: this.parseMethod(method),
      url,
      urlParts: this.parseUrl(url),
    };
  }

  protected parseUrl(url: string): Request['urlParts'] {
    const a = document.createElement('a');
    a.href = url;

    const query = new Map<string, string|string[]>();
    a.search.split('&').forEach((segment) => {
      const [k, v] = segment.split('=');
      const key = decodeURIComponent(k);
      const value = decodeURIComponent(v || '');
      const existingValue = query.get(key);
      const newValue = existingValue ?
          // if there's more than one value, convert to an array
          // (existingValue might already be an array)
          [...(typeof  existingValue === 'string' ? [existingValue] : existingValue), value] :
          value;
      query.set(key, newValue);
    });

    return {
      host: a.hostname,
      path: a.pathname,
      port: a.port,
      query,
    };
  }

  protected parseMethod(method: string): Request['method'] {
    switch (method) {
      case 'GET':
      case 'POST':
        return method;
      default:
        throw new Error(`Unexpectsd method: ${method}`);
    }
  }

  protected maybeParseBody(body: string): Request['bodyJson'] {
    try {
      return JSON.parse(body);
    } catch (e) {
      return null;
    }
  }
}
