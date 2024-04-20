import { NextButtonStyle } from './styles.css';

export default class NextButton {
  element: HTMLButtonElement;

  constructor() {
    this.element = document.createElement('button');

    this.setStyles();
  }

  setButtonText(text: string) {
    this.element.textContent = text;
  }

  setStyles() {
    this.element.className = NextButtonStyle;
  }

  appendTo(element: HTMLElement) {
    element.appendChild(this.element);
  }

  onClick(cb: () => void) {
    this.element.addEventListener('click', () => {
      cb();
    });
  }

  disable() {
    this.element.disabled = true;
  }

  enable() {
    this.element.disabled = false;
  }
}
