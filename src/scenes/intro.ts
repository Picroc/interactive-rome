import IntroBackground from '../components/introBackground';
import Skull from '../components/skull';
import Experience from '../experience';

export default class IntroScene {
  scene: Experience['scene'];
  debug: Experience['debug'];

  introBackgroundComponent: IntroBackground;
  skullComponent: Skull;

  constructor() {
    const { scene, debug } = Experience.getInstance();

    this.scene = scene;
    this.debug = debug;

    this.introBackgroundComponent = new IntroBackground();
    this.skullComponent = new Skull();

    this.setDebug();
    this.hide();
  }

  setDebug() {
    if (this.debug.active) {
      const folder = this.debug.ui.addFolder('introScene');

      folder
        .add(this.introBackgroundComponent.mesh.position, 'y')
        .max(0)
        .min(-10)
        .step(0.001);
    }
  }

  update() {}

  destroy() {
    this.scene.remove(this.introBackgroundComponent.mesh);
  }

  hide() {
    this.introBackgroundComponent.mesh.visible = false;
    this.introBackgroundComponent.hiderPlane.visible = false;
    this.skullComponent.sprite.visible = false;
  }

  show() {
    this.introBackgroundComponent.mesh.visible = true;
    this.introBackgroundComponent.hiderPlane.visible = true;
    this.skullComponent.sprite.visible = true;
  }
}
