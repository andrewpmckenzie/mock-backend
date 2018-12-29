import * as React from 'react';
import styled from 'styled-components';
import {
  backgroundColor,
  button,
  color,
  darkGreyColor,
  defaultPadding,
  foregroundColor,
  horizontalBigPadding,
  horizontalSmallPadding,
  lightGreyColor,
  padding,
  primaryColor,
  roundButtonSize,
  statusList,
  statusPosition,
  verticalSmallPadding,
} from '../../theme';

const ROUND_BORDER = '500px';

export const reset = `
  background: 0 none transparent;
  border-collapse: collapse;
  border-spacing: 0;
  border: 0;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: medium;
  line-height: 1;
  list-style: none;
  margin: 0;
  padding: 0;
  vertical-align: baseline;

  &:before,
  &:after {
    content: '';
  }

  &:focus {
    outline: none;
  }
`;

export const Progress = styled.progress`
  ${reset}

  flex: 1 1 0;

  ::-webkit-progress-bar {
    background-color: ${lightGreyColor};
    border-radius: ${ROUND_BORDER};
  }

  ::-webkit-progress-value {
    background-color: ${primaryColor};
    border-radius: ${ROUND_BORDER};
  }
`;

export const RoundButton = styled.button`
  ${reset}

  border-radius: ${ROUND_BORDER};
  color: ${foregroundColor};
  cursor: pointer;
  display: inline-block;
  flex: 0 0 ${roundButtonSize};
  font-size: 16px;
  height: ${roundButtonSize};
  line-height: 0;
  padding: 2px;
  width: ${roundButtonSize};

  &:hover {background-color: ${lightGreyColor};}
  &:active {background-color: ${darkGreyColor};}
`;

export const StatusContainer = styled.div`
  ${reset};

  bottom: ${statusPosition('bottom')};
  left: ${statusPosition('left')};
  position: fixed;
  right: ${statusPosition('right')};
  top: ${statusPosition('top')};
`;

export const StatusList = styled.ul`
  ${reset}

  background-color: ${backgroundColor};
  border: solid 1px ${lightGreyColor};
  border-radius: 12px;
  box-shadow: ${statusList(({boxShadow}) => boxShadow)};
  color: ${foregroundColor};
  display: flex;
  flex-direction: column;
  width: ${statusList(({width}) => width)};
`;

export const StatusListItem = styled.li`
  ${reset}

  align-items: center;
  border-bottom: solid 1px ${lightGreyColor};
  display: flex;
  padding: ${defaultPadding};

  & > ${Progress} {
    margin: 0 ${horizontalSmallPadding};
    height: ${statusList(({progressHeight}) => progressHeight)};
  }

  &:last-child {
    border-bottom: 0 none transparent;
  }
`;

export const StatusListItemDetails = styled.div`
  ${reset}
`;
