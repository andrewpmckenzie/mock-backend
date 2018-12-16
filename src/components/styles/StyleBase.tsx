import * as React from 'react';
import {ReactElement} from 'react';
import {ThemeProvider} from 'styled-components';
import {Theme, themeDefaults} from '../../theme';

export const StyleBase = ({children, theme = {}}: {children: ReactElement<{}>, theme?: Partial<Theme>}) => (
    <ThemeProvider theme={Object.assign({}, themeDefaults, theme)}>
      {children}
    </ThemeProvider>
);
