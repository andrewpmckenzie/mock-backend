import {Request} from './Request';
import {Response} from './Response';

export interface RespondingHandler {
  id?: string;
  claim: (request: Request) => boolean;
  handle: (request: Request) => Response;
}

export function isRespondingHandler(handler: Handler): handler is PassthroughHandler {
  return !!(handler as {handle?: () => any}).handle;
}

export interface PassthroughHandler {
  id?: string;
  claim: (request: Request) => boolean;
  passThrough: true;
}

export function isPassthroughHandler(handler: Handler): handler is PassthroughHandler {
  return !!(handler as {passThrough?: boolean}).passThrough;
}

export type Handler = RespondingHandler | PassthroughHandler;
