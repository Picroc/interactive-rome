import { Component } from 'solid-js';

import styles from './CircularButton.module.css';

export const CircularButton: Component<{
  text: string;
  disabled?: boolean;
  onClick?: () => void;
}> = (props) => {
  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      class={styles.CircularButton}
    >
      {props.text}
    </button>
  );
};
