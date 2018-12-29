import * as sinon from 'sinon';
import {Request, Response} from '../interface';
import {AbstractInterceptor} from './AbstractInterceptor';

export class XHRInterceptor extends AbstractInterceptor {
  private xhr: sinon.SinonFakeXMLHttpRequestStatic|null = null;

  public start() {
    if (this.xhr) {
      return;
    }

    this.xhr = sinon.useFakeXMLHttpRequest();
    this.xhr.onCreate = this.handleFakeXHR.bind(this);
  }

  public stop() {
    if (!this.xhr) {
      return;
    }

    this.xhr.restore();
    this.xhr = null;
  }

  private handleFakeXHR(xhr: sinon.SinonFakeXMLHttpRequest & XMLHttpRequest & {onSend?: () => void}) {
    const handler = () => {
      if (xhr.readyState !== XMLHttpRequest.OPENED) {
        return;
      } else {
        xhr.removeEventListener('readystatechange', handler);
      }

      const request: Request = this.createRequest(xhr.url, xhr.requestBody, xhr.method, xhr.requestHeaders);

      const respond = (response: Response) => {
        const {status = 200, headers = {}, body = ''} = response;
        xhr.respond(
            status,
            headers,
            typeof body === 'string' ? body : JSON.stringify(body),
        );
      };

      window.setTimeout(() => {
        this.receivedRequestSubject.next({request, respond});
      });
    };

    // Workaround for bug in sinon's fakeXHR where it sets xhr.readyState = FakeXMLHttpRequest.OPENED instead of
    // xhr.readyState = FakeXMLHttpRequest.HEADERS_RECEIVED
    const existingOnSend = xhr.onSend ? xhr.onSend : () => null;
    xhr.onSend = () => {
      existingOnSend();
      handler();
    };
  }
}
