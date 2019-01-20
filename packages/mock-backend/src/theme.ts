export type STATUS_POSITION = 'TL' | 'TR' | 'BL' | 'BR';

export const themeDefaults = {
  color: {
    accent: '#5C6BC0',
    background: '#FFF',
    darkGrey: '#78909C',
    error: '#C62828',
    extraLightGrey: '#ECEFF1',
    foreground: '#333',
    lightGrey: '#CFD8DC',
    primary: '#3949AB',
    success: '#689F38',
    warn: '#FFB300',
  },

  padding: {
    horizontalBig: '24px',
    horizontalSmall: '12px',
    verticalBig: '12px',
    verticalSmall: '8px',
  },

  button: {
    roundSize: '24px',
  },

  statusList: {
    boxShadow: '#CFD8DC 1px 1px 4px 0',
    offset: '24px',
    position: 'BR' as STATUS_POSITION,
    progressHeight: '12px',
    width: '400px',
  },
};

export type Theme = typeof themeDefaults;
export const theme = (cb: (t: Theme) => string) => (props: {theme: Theme}) => cb(props.theme);
export const subTheme = <Key extends keyof Theme>(key: Key) =>
    (cb: (p: Theme[Key]) => string) => theme((t) => cb(t[key]));

// Subtheme helpers

export const color = subTheme('color');
export const padding = subTheme('padding');
export const button = subTheme('button');
export const statusList = subTheme('statusList');

// Color helpers

export const accentColor = color(({accent}) => accent);
export const backgroundColor = color(({background}) => background);
export const extraLightGreyColor = color(({extraLightGrey}) => extraLightGrey);
export const foregroundColor = color(({foreground}) => foreground);
export const primaryColor = color(({primary}) => primary);
export const lightGreyColor = color(({lightGrey}) => lightGrey);
export const darkGreyColor = color(({darkGrey}) => darkGrey);
export const successColor = color(({success}) => success);
export const errorColor = color(({error}) => error);
export const warnColor = color(({warn}) => warn);

// Padding helpers

export const defaultPadding = padding(
    ({horizontalBig, verticalBig}) => `${verticalBig} ${horizontalBig} ${verticalBig} ${horizontalBig}`);
export const verticalBigPadding = padding(({verticalBig}) => verticalBig);
export const verticalSmallPadding = padding(({verticalSmall}) => verticalSmall);
export const horizontalBigPadding = padding(({horizontalBig}) => horizontalBig);
export const horizontalSmallPadding = padding(({horizontalSmall}) => horizontalSmall);

// Button helpers

export const roundButtonSize = button(({roundSize}) => roundSize);

// Status helpers

export interface StatusPositionOffset { top: string; bottom: string; left: string; right: string; }
export const statusPosition = (location: keyof StatusPositionOffset) => statusList(({position, offset}) => {
  switch (position) {
    case 'TR': return {top: offset, right: offset, bottom: 'inherit', left: 'inherit'}[location];
    case 'TL': return {top: offset, left: offset, bottom: 'inherit', right: 'inherit'}[location];
    case 'BR': return {bottom: offset, right: offset, top: 'inherit', left: 'inherit'}[location];
    case 'BL': return {bottom: offset, left: offset, top: 'inherit', right: 'inherit'}[location];
  }
});
