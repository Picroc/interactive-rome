import Experience from '.';
import { PerspectiveCamera, Scene } from 'three';
import Sizes from './utils/Sizes';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { Easing, Tween, update } from '@tweenjs/tween.js';

export default class Camera {
  scene: Scene;
  sizes: Sizes;
  canvas: HTMLCanvasElement;

  instance: PerspectiveCamera;
  controls: OrbitControls;
  debug: Experience['debug'];

  cameraTop = 3.0;
  isUp = true;
  isAnimating = false;

  constructor() {
    const { scene, sizes, canvas, debug } = Experience.getInstance();

    this.scene = scene;
    this.sizes = sizes;
    this.canvas = canvas;
    this.debug = debug;

    this.setInstance();
    this.setOrbitControls();
    this.setDebug();
  }

  setInstance() {
    const aspectRatio = this.sizes.width / this.sizes.height;
    this.instance = new PerspectiveCamera(40, aspectRatio, 0.1, 100);

    this.instance.position.set(0, this.cameraTop, 0);
    this.instance.rotation.set(0, 0, 0);
    this.scene.add(this.instance);
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  }

  animate(direction: 'up' | 'down', callback?: () => void) {
    if (this.isAnimating) {
      return;
    }

    this.isAnimating = true;

    const tween = new Tween(this.instance.position);
    tween.easing(
      direction === 'down' ? Easing.Quadratic.In : Easing.Quadratic.Out
    );
    tween.to({ y: direction === 'down' ? 1.35 : 3.0 }, 1000);
    tween.onComplete(() => {
      this.isAnimating = false;
      this.isUp = direction === 'up';

      callback?.();
    });
    tween.start();
  }

  setDebug() {
    const debugObject = {
      animateCamera: () => {
        this.animate(this.isUp ? 'down' : 'up');
      }
    };
    if (this.debug.active) {
      const folder = this.debug.ui.addFolder('camera');
      folder.add(debugObject, 'animateCamera');
    }
  }

  resize = () => {
    this.instance.aspect = this.sizes.getAspectRatio();
    this.instance.updateProjectionMatrix();
  };

  update = () => {
    update();
    this.controls.update();
  };
}
