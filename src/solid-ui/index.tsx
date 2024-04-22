import { render } from 'solid-js/web';
import { App } from '../solid-components/App/App';
import { createSignal } from 'solid-js';

export const initializeSolidUI = () => {
  const root = document.getElementById('root');

  if (!root) {
    throw new Error('No root');
  }

  render(() => <App globalSignal={globalSignal()} />, root);
};

const [globalSignal, setGlobalSignal] = createSignal('');

export { globalSignal, setGlobalSignal };
