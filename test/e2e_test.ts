import {PassthroughHandler, Request, RespondingHandler} from '../src/lib/interface';
import {MockBackend} from '../src/MockBackend';
import {async} from './helpers/async';
import {tick} from './helpers/tick';
import {xhr} from './helpers/xhr';

const FIXTURE_ID = 'test_mock_backend';

// Delay before the response is returned
const RESPONSE_DELAY_MS = 5000;

// Time between response state updates
const POLLING_MS = 500;

describe('E2E', () => {
  beforeAll(() => {
    jasmine.clock().install();
  });

  let mockBackend: MockBackend;
  let respondingHandlers: RespondingHandler[];
  let passThroughHandlers: PassthroughHandler[];
  let containerEl: HTMLElement;

  beforeEach(() => {
    jasmine.clock().mockDate(new Date(2019, 0, 1));

    respondingHandlers = [
      {
        claim: (r) => r.url.includes('/valid'),
        handle: (r) => ({status: 200, body: 'VALID_RESPONSE'}),
      },
      {
        claim: (r) => r.url.includes('/static/with-responding-handler.json'),
        handle: (r) => ({status: 200, body: { source: 'handler' }}),
      },
    ];

    spyOn(respondingHandlers[0], 'claim').and.callThrough();
    spyOn(respondingHandlers[0], 'handle').and.callThrough();

    passThroughHandlers = [
      {
        claim: (r: Request) => r.url.includes('/static/with-pass-through-handler.json'),
        passThrough: true,
      },
    ];

    mockBackend = MockBackend.create([...respondingHandlers, ...passThroughHandlers], {fixtureElementId: FIXTURE_ID});
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
      let response: Response|null = null;
      fetch('/invalid').then((r) => response = r);
      await tick(RESPONSE_DELAY_MS);

      expect(response!.status).toBe(404);
      expect(await response!.text()).toBe('No handler available for this request');
    }));

    it('passes through when encountering a passthrough handler', async(async () => {
      let passThroughResponse: {source: string}|null = null;
      let dontPassThroughResponse: {source: string}|null = null;
      fetch('/static/with-pass-through-handler.json').then((r) => r.json()).then((j) => passThroughResponse = j);
      fetch('/static/with-responding-handler.json').then((r) => r.json()).then((j) => dontPassThroughResponse = j);

      await tick(RESPONSE_DELAY_MS);

      expect(passThroughResponse!.source).toEqual('file');
      expect(dontPassThroughResponse!.source).toEqual('handler');
    }));

    it('provides request information to #claim() and #handle()', async(async () => {
      fetch('http://www.example.com:81/valid/foo?Q1=V1&Q2=V2', {
        body: JSON.stringify({B1: 'V3'}),
        method: 'POST',
      });

      await tick(1);

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
      expect(respondingHandlers[0].claim).toHaveBeenCalledWith(expectedRequest);
      expect(respondingHandlers[0].handle).not.toHaveBeenCalled();

      await tick(RESPONSE_DELAY_MS);

      expect(respondingHandlers[0].handle).toHaveBeenCalledWith(expectedRequest);
    }));
  });

  describe('XHR interception', () => {
    it('returns the handler\'s response claimed requests', async(async () => {
      let response: XMLHttpRequest|null = null;
      xhr('/valid').then((r) => response = r);
      await tick(RESPONSE_DELAY_MS);

      expect(response!.status).toBe(200);
      expect(response!.response).toBe('VALID_RESPONSE');
    }));

    it('replies with an error to unclaimed requests', async(async () => {
      let response: XMLHttpRequest|null = null;
      xhr('/invalid').then((r) => response = r);
      await tick(RESPONSE_DELAY_MS);

      expect(response!.status).toBe(404);
      expect(response!.response).toBe('No handler available for this request');
    }));

    it('passes through when encountering a passthrough handler', async(async () => {
      let passThroughResponse: {source: string}|null = null;
      let dontPassThroughResponse: {source: string}|null = null;

      xhr('/static/with-pass-through-handler.json').then((r) => passThroughResponse = JSON.parse(r.responseText));
      xhr('/static/with-responding-handler.json').then((r) => dontPassThroughResponse = JSON.parse(r.responseText));

      await tick(RESPONSE_DELAY_MS);

      expect(passThroughResponse!.source).toEqual('file');
      expect(dontPassThroughResponse!.source).toEqual('handler');
    }));

    it('provides request information to #claim() and #handle()', async(async () => {
      xhr('http://www.example.com:81/valid/foo?Q1=V1&Q2=V2', {
        body: JSON.stringify({B1: 'V3'}),
        method: 'POST',
      });

      await tick(1);

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
      expect(respondingHandlers[0].claim).toHaveBeenCalledWith(expectedRequest);
      expect(respondingHandlers[0].handle).not.toHaveBeenCalled();

      await tick(RESPONSE_DELAY_MS);

      expect(respondingHandlers[0].handle).toHaveBeenCalledWith(expectedRequest);
    }));
  });

  describe('progress indicator/controls', () => {
    it('displays progress towards the wait time', async(async () => {
      fetch('/valid/foobar');
      expect(containerEl.innerText).toContain('/valid/foobar');
      const progressEl = containerEl.querySelector('.StatusListItem_progress') as HTMLProgressElement;

      expect(progressEl.value).toBe(0);

      await tick(RESPONSE_DELAY_MS / 2);

      expect(progressEl.value).toBe(0.5);

      await tick(RESPONSE_DELAY_MS / 2);

      expect(containerEl.innerText).not.toContain('/valid/foobar');
    }));

    it('handles immediately when clicking the "skip" button', async(async () => {
      const responsePromise = fetch('/valid/foobar');
      const progressEl = containerEl.querySelector('.StatusListItem_handleNow') as HTMLButtonElement;

      progressEl.click();
      await tick(POLLING_MS);

      expect(containerEl.innerText).not.toContain('/valid/foobar');
      expect(await responsePromise.then((r) => r.text())).toEqual('VALID_RESPONSE');
    }));

    it('pauses and resumes handling when clicking the "pause/resume" button', async(async () => {
      const responsePromise = fetch('/valid/foobar');

      const progressEl = containerEl.querySelector('.StatusListItem_progress') as HTMLProgressElement;
      const togglePauseEl = containerEl.querySelector('.StatusListItem_togglePause') as HTMLButtonElement;

      await tick(RESPONSE_DELAY_MS / 5);
      togglePauseEl.click();

      expect(progressEl.value).toBe(0.2);

      // Advancing time should do nothing
      await tick(RESPONSE_DELAY_MS / 2);

      expect(progressEl.value).toBe(0.2);
      expect(containerEl.innerText).toContain('/valid/foobar');

      togglePauseEl.click();
      await tick(RESPONSE_DELAY_MS / 5);

      expect(progressEl.value).toBe(0.4);

      await tick(3 * RESPONSE_DELAY_MS / 5);
      expect(containerEl.innerText).not.toContain('/valid/foobar');
      expect(await responsePromise.then((r) => r.text())).toEqual('VALID_RESPONSE');
    }));
  });

  describe('defaultConfig', () => {
    beforeEach(() => {
      // All these tests set up mockBackend
      mockBackend.destroy();
      mockBackend = undefined as any;
      containerEl = undefined as any;
    });

    describe('unclaimedRequests', () => {
      it('returns an error for unclaimed requests when "ERROR"', async(async () => {
        mockBackend = MockBackend.create([], {
          defaultConfig: {unclaimedRequests: 'ERROR'},
          fixtureElementId: FIXTURE_ID,
        });

        let response: Response|null = null;
        fetch('/static/unhandled.json').then((r) => response = r);
        await tick(RESPONSE_DELAY_MS);

        expect(response!.status).toBe(404);
        expect(await response!.text()).toBe('No handler available for this request');
      }));

      it('passes through unclaimed requests when "PASS_THROUGH"', async(async () => {
        mockBackend = MockBackend.create([], {
          defaultConfig: {unclaimedRequests: 'PASS_THROUGH'},
          fixtureElementId: FIXTURE_ID,
        });

        let response: Response|null = null;
        fetch('/static/unhandled.json').then((r) => response = r);
        await tick(RESPONSE_DELAY_MS);

        expect(response!.status).toBe(200);
        expect(await response!.json()).toEqual({source: 'file'});
      }));
    });

    describe('delayBeforeResponding', () => {
      it('determines the delay before a response is sent', async(async () => {
        mockBackend = MockBackend.create([...respondingHandlers], {
          defaultConfig: {delayBeforeResponding: 10000},
          fixtureElementId: FIXTURE_ID,
        });

        let response: {status: number}|null = null;
        xhr('/valid').then((r) => response = r);
        await tick(9999);

        expect(response).toBeNull();

        await tick(1);

        expect(response).not.toBeNull();
      }));
    });
  });
});
