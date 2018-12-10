import {Handler} from '../../interface';

export interface AddHandlerAction {
  type: 'ADD_HANDLER';
  handler: Handler;
}

export function addHandler(handler: Handler): AddHandlerAction {
  return {type: 'ADD_HANDLER', handler};
}

export interface AddHandlersAction {
  type: 'ADD_HANDLERS';
  handlers: Handler[];
}

export function addHandlers(handlers: Handler[]): AddHandlersAction {
  return {type: 'ADD_HANDLERS', handlers};
}
