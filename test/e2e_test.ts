import {Handler, Request} from '../src/lib/interface';
import {MockBackend} from '../src/MockBackend';
import {async} from './helpers/async';
import {xhr} from './helpers/xhr';

const FIXTURE_ID = 'test_mock_backend';

// Delay before the response is returned
const RESPONSE_DELAY_MS = 5000;

// Time between response state updates
const POLLING_MS = 500;

describe('E2E', () => {
  let mockBackend: MockBackend;
  let handlers: Handler[];
  let containerEl: HTMLElement;

  beforeAll(() => {
    jasmine.clock().install();
  });

  beforeEach(() => {
    jasmine.clock().mockDate(new Date(2019, 0, 1));

    handlers = [
      {
        claim: jasmine.createSpy('claim', (r: Request) => r.url.includes('/valid'))
            .and.callThrough(),
        handle: jasmine.createSpy('handle', (r: Request) => ({status: 200, body: 'VALID_RESPONSE'}))
            .and.callThrough(),
      },
    ];

    mockBackend = MockBackend.create(handlers, {fixtureElementId: FIXTURE_ID});
    containerEl = document.getElementById(FIXTURE_ID)!;
  });

  afterEach(() => {
    if (mockBackend) {
      mockBackend.destroy();
    }
  });

  describe('fetch() interception', () => {
    it('returns the handler\'s response claimed requests', async(async () => {
      const responsePromise = fetch('/valid');
      jasmine.clock().tick(RESPONSE_DELAY_MS);

      const response = await responsePromise;
      expect(response.status).toBe(200);
      expect(await response.text()).toBe('VALID_RESPONSE');
    }));

    it('replies with an error to unclaimed requests', async(async () => {
      const responsePromise = fetch('/invalid');
      jasmine.clock().tick(RESPONSE_DELAY_MS);

      const response = await responsePromise;
      expect(response.status).toBe(404);
      expect(await response.text()).toBe('No handler available for this request');
    }));

    it('provides request information to #claim() and #handle()', async(async () => {
      fetch('http://www.example.com:81/valid/foo?Q1=V1&Q2=V2', {
        body: JSON.stringify({B1: 'V3'}),
        method: 'POST',
      });

      jasmine.clock().tick(1);

      const expectedRequest: Request = {
        body: '{"B1":"V3"}',
        bodyJson: {B1: 'V3'},
        headers: jasmine.objectContaining({}) as {},
        method: 'POST',
        url: 'http://www.example.com:81/valid/foo?Q1=V1&Q2=V2',
        urlParts: {
          host: 'www.example.com',
          path: '/valid/foo',
          port: '81',
          query: new Map([
              ['Q1', 'V1'],
              ['Q2', 'V2'],
          ]),
        },
      };
      expect(handlers[0].claim).toHaveBeenCalledWith(expectedRequest);
      expect(handlers[0].handle).not.toHaveBeenCalled();

      jasmine.clock().tick(RESPONSE_DELAY_MS);

      expect(handlers[0].handle).toHaveBeenCalledWith(expectedRequest);
    }));
  });

  describe('XHR interception', () => {
    it('returns the handler\'s response claimed requests', async(async () => {
      const responsePromise = xhr('/valid');
      jasmine.clock().tick(RESPONSE_DELAY_MS);

      const {status, response} = await responsePromise;
      expect(status).toBe(200);
      expect(response).toBe('VALID_RESPONSE');
    }));

    it('replies with an error to unclaimed requests', async(async () => {
      const responsePromise = xhr('/invalid');
      jasmine.clock().tick(RESPONSE_DELAY_MS);

      const {status, response} = await responsePromise;
      expect(status).toBe(404);
      expect(response).toBe('No handler available for this request');
    }));

    it('provides request information to #claim() and #handle()', async(async () => {
      xhr('http://www.example.com:81/valid/foo?Q1=V1&Q2=V2', {
        body: JSON.stringify({B1: 'V3'}),
        method: 'POST',
      });

      jasmine.clock().tick(1);

      const expectedRequest: Request = {
        body: '{"B1":"V3"}',
        bodyJson: {B1: 'V3'},
        headers: jasmine.objectContaining({}) as {},
        method: 'POST',
        url: 'http://www.example.com:81/valid/foo?Q1=V1&Q2=V2',
        urlParts: {
          host: 'www.example.com',
          path: '/valid/foo',
          port: '81',
          query: new Map([
              ['Q1', 'V1'],
              ['Q2', 'V2'],
          ]),
        },
      };
      expect(handlers[0].claim).toHaveBeenCalledWith(expectedRequest);
      expect(handlers[0].handle).not.toHaveBeenCalled();

      jasmine.clock().tick(RESPONSE_DELAY_MS);

      expect(handlers[0].handle).toHaveBeenCalledWith(expectedRequest);
    }));
  });

  describe('progress indicator/controls', () => {
    it('displays progress towards the wait time', async(async () => {
      fetch('/valid/foobar');
      expect(containerEl.innerText).toContain('/valid/foobar');
      const progressEl = containerEl.querySelector('.StatusListItem_progress') as HTMLProgressElement;

      expect(progressEl.value).toBe(0);

      jasmine.clock().tick(RESPONSE_DELAY_MS / 2);

      expect(progressEl.value).toBe(0.5);

      jasmine.clock().tick(RESPONSE_DELAY_MS / 2);

      expect(containerEl.innerText).not.toContain('/valid/foobar');
    }));

    it('handles immediately when clicking the "skip" button', async(async () => {
      const responsePromise = fetch('/valid/foobar');
      const progressEl = containerEl.querySelector('.StatusListItem_handleNow') as HTMLButtonElement;

      progressEl.click();
      jasmine.clock().tick(POLLING_MS);

      expect(containerEl.innerText).not.toContain('/valid/foobar');
      expect(await responsePromise.then((r) => r.text())).toEqual('VALID_RESPONSE');
    }));

    it('pauses and resumes handling when clicking the "pause/resume" button', async(async () => {
      const responsePromise = fetch('/valid/foobar');

      const progressEl = containerEl.querySelector('.StatusListItem_progress') as HTMLProgressElement;
      const togglePauseEl = containerEl.querySelector('.StatusListItem_togglePause') as HTMLButtonElement;

      jasmine.clock().tick(RESPONSE_DELAY_MS / 5);
      togglePauseEl.click();

      expect(progressEl.value).toBe(0.2);

      // Advancing time should do nothing
      jasmine.clock().tick(RESPONSE_DELAY_MS / 2);

      expect(progressEl.value).toBe(0.2);
      expect(containerEl.innerText).toContain('/valid/foobar');

      togglePauseEl.click();
      jasmine.clock().tick(RESPONSE_DELAY_MS / 5);

      expect(progressEl.value).toBe(0.4);

      jasmine.clock().tick(3 * RESPONSE_DELAY_MS / 5);
      expect(containerEl.innerText).not.toContain('/valid/foobar');
      expect(await responsePromise.then((r) => r.text())).toEqual('VALID_RESPONSE');
    }));
  });
});
