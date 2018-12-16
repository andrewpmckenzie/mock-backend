import * as React from 'react';
import {SkipNext} from 'styled-icons/boxicons-regular';
import {Pause, PlayArrow} from 'styled-icons/material';
import {RequestWithMetadata} from '../lib/interface';
import {
  Progress,
  RoundButton,
  StatusContainer,
  StatusList,
  StatusListItem,
  StatusListItemDetails,
} from './styles/StyledComponents';

export interface AppProps {
  requests: RequestWithMetadata[];
  togglePause: (r: RequestWithMetadata) => void;
  handleNow: (r: RequestWithMetadata) => void;
}

export const App = ({requests, togglePause, handleNow}: AppProps) => (
  <StatusContainer>
    {
      requests.length ?
          <StatusList>
            {requests.map((r) => (
              <StatusListItem key={r.id}>
                <StatusListItemDetails>{r.request.url}</StatusListItemDetails>
                <Progress value={r.percentProgress} max={1} />
                <RoundButton onClick={() => togglePause(r)}>
                  {r.handlingPaused ? <PlayArrow /> : <Pause />}
                </RoundButton>
                <RoundButton onClick={() => handleNow(r)}><SkipNext /></RoundButton>
              </StatusListItem>
            ))}
          </StatusList>
          : null
    }
  </StatusContainer>
);
