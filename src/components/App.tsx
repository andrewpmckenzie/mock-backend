import * as React from 'react';
import {Handler, RequestWithMetadata} from '../lib/interface';

export interface AppProps {
  handlers: Handler[];
  requests: RequestWithMetadata[];
}

export const App = ({requests}: AppProps) => (
  <ul>
    {requests.map((r) => (
      <div key={r.id}>{r.request.url}</div>
    ))}
  </ul>
);
