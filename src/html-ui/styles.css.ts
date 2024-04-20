import { style } from '@vanilla-extract/css';

export const NextButtonStyle = style({
  backgroundColor: 'gray',
  margin: '50px',
  alignSelf: 'end',
  width: '50px',
  height: '50px',
  borderRadius: '25px',
  outline: '0',
  border: '0',
  ':active': {
    transform: 'scale(0.9)'
  }
});
