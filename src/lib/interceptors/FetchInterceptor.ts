import {mock, MockResponse, restore} from 'fetch-mock';
import {Response} from '../interface';
import {AbstractInterceptor} from './AbstractInterceptor';

export class FetchInterceptor extends AbstractInterceptor {
  private isRunning = false;

  public start(): void {
    if (this.isRunning) {
      return;
    }

    mock('*', (url, {
      method = 'GET', body = '', headers = {},
    } = {}) => new Promise((resolve) => {
      const normalizedBody = typeof body === 'string' ? body : JSON.stringify(body);
      // TODO: extract fetch headers
      const normalizedHeaders = {};
      const request = this.createRequest(url, normalizedBody, method, normalizedHeaders);

      const respond: (r: Response) => void = ({status, body, headers}) => {
        const mockResponse: MockResponse = {status, body, headers};
        resolve(mockResponse);
      };

      this.receivedRequestSubject.next({request, respond});
    }));
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
