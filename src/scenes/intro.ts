import { Group } from 'three';
import IntroBackground from '../components/introBackground/IntroBackgound';
import Skull from '../components/skull/Skull';
import Experience from '../experience/Experience';
import { Easing, Tween } from '@tweenjs/tween.js';

export default class IntroScene {
  scene: Experience['scene'];
  debug: Experience['debug'];

  sceneGroup: Group;

  introBackgroundComponent: IntroBackground;
  skullComponent: Skull;

  constructor() {
    const { scene, debug } = Experience.getInstance();

    this.scene = scene;
    this.debug = debug;

    this.sceneGroup = new Group();

    this.introBackgroundComponent = new IntroBackground(this.sceneGroup);
    this.skullComponent = new Skull(this.sceneGroup);

    this.setDebug();
    this.hide();

    scene.add(this.sceneGroup);
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

  setForUp() {
    this.sceneGroup.position.z = 0.0;
  }

  setForDown() {
    this.sceneGroup.position.z = 3.0;
  }

  animateUp(cb?: () => void) {
    const tween = new Tween(this.sceneGroup.position);
    tween.easing(Easing.Quadratic.In);
    tween.to({ z: 3.0 }, 700);
    tween.onComplete(() => {
      cb?.();
    });
    tween.start();
  }

  animateDown(cb?: () => void) {
    const tween = new Tween(this.sceneGroup.position);
    tween.easing(Easing.Quadratic.Out);
    tween.to({ z: 0.0 }, 700);
    tween.onComplete(() => {
      cb?.();
    });
    tween.start();
  }
}
