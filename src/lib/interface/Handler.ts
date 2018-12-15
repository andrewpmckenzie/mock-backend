import {Request} from './Request';
import {Response} from './Response';

export interface Handler {
  id?: string;
  claim: (request: Request) => boolean;
  handle: (request: Request) => Response;
}
