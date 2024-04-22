import { Component, Show } from 'solid-js';

import styles from './App.module.css';
import { ActionTrigger } from '../ActionsTrigger/ActionsTrigger';

export const App: Component<{ globalSignal: string }> = (props) => {
  return (
    <>
      <Show when={props.globalSignal}>
        <div
          style={{
            display: 'flex',
            position: 'fixed',
            'flex-direction': 'column',
            'justify-items': 'center'
          }}
        >
          <div
            style={{
              padding: '10px',
              background: 'white',
              border: '3px solid #000',
              'border-top': '0',
              'border-left': '0',
              display: 'flex',
              'flex-direction': 'row',
              'flex-grow': '0',
              'border-bottom-right-radius': '30px'
            }}
          >
            <h1 class="cinzel-header">{props.globalSignal}</h1>
          </div>
        </div>
      </Show>
      <div class={styles.App}>
        <ActionTrigger />
      </div>
    </>
  );
};
