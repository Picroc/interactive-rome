import * as gui from "lil-gui";

export default class Debug {
  active: boolean;
  ui: gui.GUI;

  constructor() {
    this.active = window.location.hash === "#debug";

    if (this.active) {
      this.ui = new gui.GUI();
    }
  }
}
