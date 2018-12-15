import * as React from 'react';
import {RequestWithMetadata} from '../lib/interface';

export interface AppProps {
  requests: RequestWithMetadata[];
  togglePause: (r: RequestWithMetadata) => void;
  handleNow: (r: RequestWithMetadata) => void;
}

export const App = ({requests, togglePause, handleNow}: AppProps) => (
  <ul>
    {requests.map((r) => (
      <div key={r.id}>
        {r.request.url}&nbsp;
        ({r.handler ? r.handler.id : 'unhandled'} in {r.msTillHandled})&nbsp;
        <button onClick={() => handleNow(r)}>NOW</button>&nbsp;
        <button onClick={() => togglePause(r)}>{r.handlingPaused ? 'UNPAUSE' : 'PAUSE'}</button>
      </div>
    ))}
  </ul>
);
