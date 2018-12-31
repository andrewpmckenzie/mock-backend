import {mock, MockResponse, restore} from 'fetch-mock';
import {Response} from '../interface';
import {AbstractInterceptor} from './AbstractInterceptor';

export class FetchInterceptor extends AbstractInterceptor {
  private isRunning = false;

  public start(): void {
    if (this.isRunning) {
      return;
    }

    let passThroughNextRequest = false;
    const fetchMock = mock(() => {
      if (passThroughNextRequest) {
        passThroughNextRequest = false;
        return false;
      } else {
        return true;
      }
    }, (url, opt = {}) => new Promise((resolve) => {
      const method = opt.method || 'GET';
      const body = opt.body || '';
      const headers = opt.headers || {};
      const normalizedBody = typeof body === 'string' ? body : JSON.stringify(body);
      // TODO: extract fetch headers
      const normalizedHeaders = {};
      const request = this.createRequest(url, normalizedBody, method, normalizedHeaders);

      const respond: (r: Response) => void = ({status, body, headers}) => {
        const mockResponse: MockResponse = {status, body, headers};
        resolve(mockResponse);
      };

      const passThrough = () => {
        passThroughNextRequest = true;
        fetch(url, opt).then((r) => resolve(r));
      };

      this.receivedRequestSubject.next({request, respond, passThrough});
    }));

    const fetchMockConfig = (fetchMock as {} as {config: {fallbackToNetwork: boolean, warnOnFallback: boolean}}).config;
    fetchMockConfig.fallbackToNetwork = true;
    fetchMockConfig.warnOnFallback = true;

    this.isRunning = true;
  }

  public stop(): void {
    if (!this.isRunning) {
      return;
    }

    restore();
    this.isRunning = false;
  }
}
