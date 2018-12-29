import * as React from 'react';
import styled from 'styled-components';
import {Pause, Stop} from 'styled-icons/material';
import {StyleBase} from './StyleBase';
import {
  Progress,
  reset,
  RoundButton,
  StatusContainer,
  StatusList, StatusListItem,
  StatusListItemDetails,
} from './StyledComponents';

const DemoContainer = styled.div`
  ${reset}

  padding: 24px;
`;

const DemoTitle = styled.h1`
  ${reset}

  font-size: 250%;
  font-weight: bold;
  margin-bottom: 24px;
`;

const DemoHeader = styled.h2`
  ${reset}

  font-size: 200%;
  margin-bottom: 12px;
`;

const DemoButton = styled.button`
  ${reset}

  border: solid 1px #aaa;
  cursor: pointer;
  border-radius: 4px;
  padding: 8px 16px;

  &:hover,
  &:active {
    background-color: #eee;
  }
`;

const DemoSection = styled.div`
  ${reset}

  margin-bottom: 24px;
`;

const DemoHighlight = styled.div`
  ${reset}

  background-color: red;
  color: white;
  font-weight: bold;
  padding: 8px;
`;

export class StyledComponentsDemo extends React.Component<{},
    {showStatusContainer: boolean, showPopup: boolean}> {
  constructor(props: Readonly<{}>) {
    super(props);

    this.state = {showPopup: false, showStatusContainer: false};
  }

  public render() {
    const {showStatusContainer, showPopup} = this.state;

    return (
      <StyleBase>
        <DemoContainer>
          <DemoTitle>MockBackend component styles</DemoTitle>

          <DemoSection>
            <DemoButton onClick={() => this.setState({showStatusContainer: !showStatusContainer})}>
              {showStatusContainer ? 'Hide' : 'Show'} status container
            </DemoButton>
            {
              showStatusContainer ?
                  <StatusContainer><DemoHighlight>Status Container</DemoHighlight></StatusContainer> :
                  null
            }
          </DemoSection>

          <DemoHeader>StatusList + StatusListItem</DemoHeader>
          <DemoSection>
            <StatusList>
              <StatusListItem>
                <StatusListItemDetails>List item one</StatusListItemDetails>
                <Progress value='25' max='100' />
                <RoundButton><Stop /></RoundButton>
                <RoundButton><Pause /></RoundButton>
              </StatusListItem>

              <StatusListItem>
                <StatusListItemDetails>List item two</StatusListItemDetails>
              </StatusListItem>
            </StatusList>
          </DemoSection>

        </DemoContainer>
      </StyleBase>
    );
  }
}
