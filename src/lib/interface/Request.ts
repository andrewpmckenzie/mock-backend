import {Omit} from 'react-redux';
import {Handler} from './Handler';
import {Response} from './Response';

export interface Request {
  body: string;
  bodyJson: object|null;
  headers: {[key: string]: string};
  method: 'GET' | 'POST';
  url: string;
  urlParts: {
    host: string;
    port: string;
    path: string;
    query: Map<string, string|string[]>;
  };
}

// Request containers

export interface RespondableRequest {
  request: Request;
  respond: (response: Response) => void;
  passThrough: () => void;
}

export interface RespondableRequestWithMetadata extends RespondableRequest {
  id: number;
  received: Date;
  pausedSince?: Date|null;
  pauseTimeMs?: number;
  percentProgress?: number;
  handlingPaused?: boolean;
  responseDelay?: number;
  handler?: Handler;
  handleAt?: Date|null;
}

export type RequestWithMetadata = Omit<RespondableRequestWithMetadata, 'respond'>;

export type RespondFunctionWithId = Pick<RespondableRequestWithMetadata, 'id'> &
                            Pick<RespondableRequestWithMetadata, 'respond'>;
