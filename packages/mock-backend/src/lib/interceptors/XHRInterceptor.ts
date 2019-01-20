import {fakeXhr, FakeXMLHttpRequest, FakeXMLHttpRequestStatic} from 'nise';
import {Request, Response} from '../interface';
import {AbstractInterceptor} from './AbstractInterceptor';

export class XHRInterceptor extends AbstractInterceptor {
  private xhr: FakeXMLHttpRequestStatic|null = null;
  private passThroughNextRequest = false;

  public start() {
    if (this.xhr) {
      return;
    }

    this.xhr = fakeXhr.useFakeXMLHttpRequest();
    this.xhr.useFilters = true;
    this.xhr.addFilter((method, url, async, username, password) => {
      if (this.passThroughNextRequest) {
        this.passThroughNextRequest = false;
        return true;
      } else {
        return false;
      }
    });
    this.xhr.onCreate = this.handleFakeXHR.bind(this);
  }

  public stop() {
    if (!this.xhr) {
      return;
    }

    this.xhr.restore();
    this.xhr = null;
  }

  private handleFakeXHR(xhr: FakeXMLHttpRequest & XMLHttpRequest & {onSend?: () => void}) {
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

      const passThrough = () => {
          this.passThroughNextRequest = true;

          const realRequest = new XMLHttpRequest();
          realRequest.addEventListener('load', () => {
            xhr.respond(realRequest.status, realRequest.getAllResponseHeaders(), realRequest.responseText);
          });
          realRequest.open(xhr.method, xhr.url, xhr.async, xhr.username, xhr.password);
          realRequest.send(xhr.requestBody);
      };

      window.setTimeout(() => {
        this.receivedRequestSubject.next({request, respond, passThrough});
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
