import {Handler, RespondableRequestWithMetadata} from '../../interface';

export interface AddRequestAction {
  type: 'REQUEST::ADD_REQUEST';
  respondableRequest: RespondableRequestWithMetadata;
}

export function addRequest(respondableRequest: RespondableRequestWithMetadata): AddRequestAction {
  return {type: 'REQUEST::ADD_REQUEST', respondableRequest};
}

export interface AssignHandlerAction {
  type: 'REQUEST::ASSIGN_HANDLER';
  requestId: number;
  handler: Handler;
  responseDelay: number;
}

export function assignHandler(requestId: number, handler: Handler, responseDelay: number): AssignHandlerAction {
  return {type: 'REQUEST::ASSIGN_HANDLER', requestId, handler, responseDelay};
}

export interface TickAction {
  type: 'REQUEST::TICK';
  requestId: number;
}

export function tick(requestId: number): TickAction {
  return {type: 'REQUEST::TICK', requestId};
}

export interface HandledAction {
  type: 'REQUEST::HANDLED';
  requestId: number;
}

export function handled(requestId: number): HandledAction {
  return {type: 'REQUEST::HANDLED', requestId};
}

export interface HandleNowAction {
  type: 'REQUEST::HANDLE_NOW';
  requestId: number;
}

export function handleNow(requestId: number): HandleNowAction {
  return {type: 'REQUEST::HANDLE_NOW', requestId};
}

export interface PauseAction {
  type: 'REQUEST::PAUSE';
  requestId: number;
}

export function pause(requestId: number): PauseAction {
  return {type: 'REQUEST::PAUSE', requestId};
}

export interface UnpauseAction {
  type: 'REQUEST::UNPAUSE';
  requestId: number;
}

export function unpause(requestId: number): UnpauseAction {
  return {type: 'REQUEST::UNPAUSE', requestId};
}

export type RequestActions =
    AddRequestAction | AssignHandlerAction | TickAction | HandledAction | HandleNowAction | PauseAction | UnpauseAction;
